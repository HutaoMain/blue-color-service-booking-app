import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import moment from 'moment';
import {UserInterface} from '../types';
import ConfirmationModal from './ConfirmationModal';
import {FIREBASE_DB} from '../firebaseConfig';
import {doc, updateDoc} from 'firebase/firestore';

interface WorkerCardProps {
  user: UserInterface;
}

export default function WorkerCard({user}: WorkerCardProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleDeactivate = async (isDeactivated: boolean) => {
    try {
      const userRef = doc(FIREBASE_DB, 'users', user.id);
      await updateDoc(userRef, {
        isDeactivated: isDeactivated,
      });

      Alert.alert(
        `User ${isDeactivated ? 'deativated' : 'activated'} successfully`,
      );

      console.log('User deactivated successfully');
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.card}>
      <Image source={{uri: user.imageUrl}} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.role}>{user.role}</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        <Text style={styles.info}>
          Birth Date: {moment(user.birthDate.toDate()).format('MMMM D, YYYY')}
        </Text>
        <Text style={styles.info}>Gender: {user.gender}</Text>
        <Text style={styles.info}>Contact: {user.contactNumber}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              {backgroundColor: user.isWorkerApproved ? 'green' : 'red'},
            ]}
          />
          <Text style={styles.statusText}>
            {user.isWorkerApproved ? 'Approved' : 'Not Approved'}
          </Text>
        </View>
        {user.isDeactivated ? (
          <Text style={styles.deactivatedText}>Account Deactivated</Text>
        ) : null}

        <TouchableOpacity
          style={
            user.isDeactivated
              ? [{backgroundColor: 'green'}, styles.deactivateButton]
              : [{backgroundColor: '#FF0000'}, styles.deactivateButton]
          }
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.deactivateButtonText}>
            {user.isDeactivated ? 'Activate' : 'Deactivate'}
          </Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={() => handleDeactivate(!user.isDeactivated)}
        onCancel={() => setIsModalVisible(false)}
        message={`Are you sure you want to ${
          !user.isDeactivated ? 'deativated' : 'activated'
        } ${user.fullName}'s account?`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deactivatedText: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 4,
  },
  deactivateButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 100,
    alignItems: 'center',
  },
  deactivateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
