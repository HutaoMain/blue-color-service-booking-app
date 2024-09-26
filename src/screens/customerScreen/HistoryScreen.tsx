import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import moment from 'moment';
import {useState} from 'react';
import useFetchUserData from '../../utilities/useFetchUserData';
import {BookingInterface} from '../../types';
import Navbar from '../../components/Navbar';
import Rating from '../../components/Rating';
import {bluegreen} from '../../reusbaleVariables';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import useFetchListOfBookingsWithFilter from '../../utilities/useFetchListOfBookingsWithFilter';
import ConfirmationModal from '../../components/ConfirmationModal';
import {doc, updateDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebaseConfig';

export default function HistoryScreen() {
  const {userData} = useFetchUserData();

  const {ListOfBooking, refreshBookings} = useFetchListOfBookingsWithFilter({
    filterField: 'customerEmail',
    filterValue: userData?.email || '',
  });

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [selectedCustomerEmail, setSelectedCustomerEmail] =
    useState<string>('');
  const [selectedWorkerEmail, setSelectedWorkerEmail] = useState<string>('');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted':
        return styles.acceptedStatus;
      case 'pending':
        return styles.pendingStatus;
      case 'cancelled':
        return styles.cancelledStatus;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    setRefreshing(false);
  };

  const handleRateService = (
    bookingId: string,
    customerEmail: string,
    workerEmail: string,
  ) => {
    setSelectedBookingId(bookingId);
    setSelectedCustomerEmail(customerEmail);
    setSelectedWorkerEmail(workerEmail);
    setModalVisible(true);
  };

  const handleCancelBooking = async () => {
    try {
      const userRef = doc(FIREBASE_DB, 'bookings', selectedBookingId);
      await updateDoc(userRef, {
        status: 'cancelled',
      });
      Alert.alert(
        `Booking cancelled.`,
        `Booking ID ${selectedBookingId} is already cancelled.`,
      );
      setIsConfirmationModalVisible(false);
      await refreshBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const openConfirmationModal = (bookingId: string) => {
    console.log('bookingid: ', bookingId);
    setIsConfirmationModalVisible(true);
    setSelectedBookingId(bookingId);
  };

  const renderItem = ({item}: {item: BookingInterface}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.categoryService}>{item.categoryService}</Text>
      <Text style={styles.specificService}>{item.specificService}</Text>
      <Text style={styles.location}>
        {item.region.name}, {item.province.name}, {item.city.name},{' '}
        {item.barangay.name}
      </Text>
      <Text style={styles.additionalDetail}>{item.additionalDetail}</Text>

      {item.ifDoneStatus === 'done' ? (
        <Text style={styles.additionalDetail}>
          Status: {item.serviceAmountPaid}
        </Text>
      ) : null}

      {item.ifDoneStatus === 'done' &&
        (item.rating === 0 || !item.rating ? (
          <TouchableOpacity
            style={styles.ratingBtn}
            onPress={() =>
              handleRateService(item.id, item.customerEmail, item.workerEmail)
            }>
            <Text style={styles.ratingTxt}>Rate Service</Text>
          </TouchableOpacity>
        ) : (
          <StarRatingDisplay
            rating={item.rating}
            starSize={30}
            color="#FFD700"
          />
        ))}
      {/* add a button here then create another reusable component where the user must rate a star*/}
      <Text style={[styles.status, getStatusStyle(item.status)]}>
        Status: {item.status}
      </Text>
      {item.ifDoneStatus !== 'done' && item.status !== 'cancelled' ? (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => openConfirmationModal(item.id)}>
          <Text style={{color: 'white'}}>Cancel Service</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.createdAt}>
        Created At:{' '}
        {moment(item.createdAt?.toDate()).local().format('YYYY-MM-DD hh:mm A')}
      </Text>
    </View>
  );

  return (
    <>
      <Navbar
        title="Booking History"
        profileImageUrl={
          userData
            ? userData.imageUrl
            : '../../assets/Profile_avatar_placeholder_large.png'
        }
      />
      <View style={styles.container}>
        <FlatList
          data={ListOfBooking}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Rating
          bookingId={selectedBookingId}
          customerEmail={selectedCustomerEmail}
          workerEmail={selectedWorkerEmail}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        onConfirm={() => handleCancelBooking()}
        onCancel={() => setIsConfirmationModalVisible(false)}
        message={`Are you sure you want to cancel your booking?`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  categoryService: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  specificService: {
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  additionalDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    width: 150,
    padding: 10,
    borderRadius: 10,
    textTransform: 'capitalize',
  },
  createdAt: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  acceptedStatus: {
    backgroundColor: 'lightgreen',
  },
  pendingStatus: {
    backgroundColor: 'yellow',
  },
  cancelledStatus: {
    backgroundColor: 'red',
    color: 'white',
  },
  cancelBtn: {
    width: 150,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FF0000',
    alignItems: 'center',
  },
  ratingBtn: {
    width: 150,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: bluegreen,
  },
  ratingTxt: {
    color: '#ffff',
  },
});
