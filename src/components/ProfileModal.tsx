import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {useFetchWorkerRatings} from '../utilities/useFetchWorkerRatings';
import {useFetchWorker} from '../utilities/useFetchWorker';
import moment from 'moment';
import {addDoc, collection} from 'firebase/firestore';
import {FIREBASE_DB} from '../firebaseConfig';
import useAuthStore from '../zustand/AuthStore';
import useFetchUserData from '../utilities/useFetchUserData';
import {useFetchReportedWorker} from '../utilities/useFetchReportedWorker';

const ProfileModal = ({
  visible,
  workerEmail: workerId,
  onClose,
}: {
  visible: boolean;
  workerEmail: string;
  onClose: () => void;
}) => {
  const {userData: workerData, refresh} = useFetchWorker(workerId);
  const user = useAuthStore(state => state.user);

  const {reports} = useFetchReportedWorker(workerData?.email || '', user || '');

  const {refreshRatings, averageRating} = useFetchWorkerRatings(
    workerData?.email || '',
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    await refreshRatings();
    setRefreshing(false);
  };

  const handleReport = async () => {
    Alert.alert(
      'Report Worker',
      'Are you sure you want to report this worker?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Report',
          onPress: async () => {
            try {
              // Add a new report to the "reports" collection
              const docRef = await addDoc(collection(FIREBASE_DB, 'reports'), {
                customerEmail: user,
                workerEmail: workerData?.email,
                reportedAt: new Date().toISOString(),
              });

              console.log('Reported worker:', workerData?.email);
              console.log('Document written with ID: ', docRef.id);
            } catch (error) {
              console.error('Error reporting worker: ', error);
            }
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Worker Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.coverPhotoContainer}>
            <Image
              source={{
                uri:
                  workerData?.imageUrl || 'https://via.placeholder.com/400x200',
              }}
              style={styles.coverPhoto}
            />
            <View style={styles.profileInfoOverlay}>
              <Text style={styles.profileName}>{workerData?.fullName}</Text>
              <Text style={styles.profileEmail}>{workerData?.email}</Text>
              <Text style={{fontSize: 25, marginVertical: 10, color: 'black'}}>
                {workerData?.workTitle}
              </Text>
              <StarRatingDisplay
                rating={averageRating || 0}
                color="#FFD700"
                starSize={20}
                style={styles.starRating}
              />
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>Basic Info</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Birth Date:</Text>
                <Text style={styles.infoValue}>
                  {workerData?.birthDate
                    ? moment(workerData.birthDate.toDate()).format(
                        'MMMM D, YYYY',
                      )
                    : 'Not provided'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender:</Text>
                <Text style={styles.infoValue}>
                  {workerData?.gender
                    ? workerData.gender.charAt(0).toUpperCase() +
                      workerData.gender.slice(1)
                    : 'Not specified'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!reports ? (
            <TouchableOpacity
              onPress={handleReport}
              style={styles.reportButton}>
              <Text style={styles.reportButtonText}>Report Worker</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={onClose} style={styles.closeModalButton}>
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  coverPhotoContainer: {
    position: 'relative',
    height: 200,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  profileName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  starRating: {
    marginTop: 4,
  },
  infoSection: {
    padding: 16,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666',
    fontSize: 16,
  },
  infoValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  reportButton: {
    backgroundColor: '#ff4444',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeModalButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
