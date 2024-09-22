import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {collection, getDocs, query, updateDoc, where} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebaseConfig';
import {useFetchAllDocuments} from '../../utilities/useFetchAllDocuments';

import {Button, Menu} from 'react-native-paper';
import {useFetchAllUsers} from '../../utilities/useFetchAllUsers';
import {useNavigation} from '@react-navigation/native';
import {ApplicantListNavigationProps} from '../../typesNavigation';
import {DocumentInterface} from '../../types';
import Navbar from '../../components/Navbar';
import useFetchUserData from '../../utilities/useFetchUserData';

export default function ApplicantList() {
  const [visible, setVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const closeMenu = () => setVisible(false);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  const navigate = useNavigation<ApplicantListNavigationProps['navigation']>();

  const {documents, refreshDocuments} = useFetchAllDocuments();
  const {users, refreshUsers} = useFetchAllUsers();
  const {userData} = useFetchUserData();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshDocuments();
    refreshUsers();
    setRefreshing(false);
  }, [refreshDocuments]);

  const openMenu = (documentId: string) => {
    setSelectedDocument(documentId);
    setVisible(true);
  };

  const handleStatusChange = async (
    email: string,
    workerApplicationStatus: string,
  ) => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'users'),
        where('email', '==', email),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].ref;
        await updateDoc(userDoc, {
          workerApplicationStatus: workerApplicationStatus,
        });
        console.log('User status updated successfully.');
        Alert.alert('User status updated successfully.');
        refreshDocuments();
      } else {
        console.log('No user found with the given email.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleSelect = (workerApplicationStatus: string) => {
    const document = documents.find(doc => doc.id === selectedDocument);
    if (document) {
      handleStatusChange(document.email, workerApplicationStatus);
    }
    closeMenu();
  };

  const navigateToViewApplicantList = (document: DocumentInterface) => {
    navigate.navigate('ViewApplicantDocuments', {
      id: document.id,
      certificateUrl: document.certificateUrl,
      certificateFileName: document.certificateFileName,
      email: document.email,
      licenseUrl: document.licenseUrl,
      licenseFileName: document.licenseFileName,
      validIdUrl: document.validIdUrl,
      validIdFileName: document.validIdFileName,
      createdAt: document.createdAt,
    });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Navbar
        profileImageUrl={
          userData
            ? userData.imageUrl
            : '../../assets/Profile_avatar_placeholder_large.png'
        }
        title="Applicant List"
      />
      {documents.map(document => {
        const user = users.find(u => u.email === document.email);
        return (
          <View key={document.id} style={styles.card}>
            <Text style={{color: 'gray'}}>Worker Email: {document.email}</Text>
            <Button
              onPress={() => navigateToViewApplicantList(document)}
              style={styles.btn}>
              <Text style={{color: 'black'}}> View Application</Text>
            </Button>
            <Menu
              visible={visible && selectedDocument === document.id}
              onDismiss={closeMenu}
              anchor={
                <Button
                  onPress={() => openMenu(document.id)}
                  style={
                    user?.workerApplicationStatus === 'approve'
                      ? [{backgroundColor: '#4CAF50'}, styles.btn]
                      : user?.workerApplicationStatus === 'pending'
                      ? [{backgroundColor: '#efc549'}, styles.btn]
                      : [{backgroundColor: '#f44336'}, styles.btn]
                  }>
                  <Text style={{color: 'white'}}>
                    {user?.workerApplicationStatus === 'approve'
                      ? 'Approved'
                      : user?.workerApplicationStatus === 'reject'
                      ? 'Rejected'
                      : 'Pending'}
                  </Text>
                </Button>
              }>
              <Menu.Item
                onPress={() => handleSelect('approve')}
                title="Approve"
              />
              <Menu.Item
                onPress={() => handleSelect('reject')}
                title="Reject"
              />
              <Menu.Item
                onPress={() => handleSelect('pending')}
                title="Pending"
              />
            </Menu>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  btn: {
    marginTop: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});
