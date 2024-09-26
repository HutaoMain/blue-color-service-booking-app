import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import {doc, updateDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebaseConfig';
import useFetchListOfBookings from '../../utilities/useFetchListOfBookings';
import useFetchUserData from '../../utilities/useFetchUserData';
import {createConversationIfNotExists} from '../../reusbaleVariables';
import {BookingInterface} from '../../types';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

export default function ListOfBookingScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingBookingStatus, setLoadingBookingStatus] =
    useState<boolean>(false);
  const [loadingIfDoneStatus, setLoadingIfDoneStatus] =
    useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingId, setBookingId] = useState('');

  console.log('bookingId: ', bookingId);

  const {userData, refresh} = useFetchUserData();

  const {ListOfBooking, refreshBookings} = useFetchListOfBookings();

  const listOfAvailableBookings = ListOfBooking.filter(
    item => item.status === 'pending',
  );

  const listOfBookingFiltered = listOfAvailableBookings.filter(
    item => item.status !== 'cancelled',
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    await refresh();
    setRefreshing(false);
  };

  const handleAcceptBooking = async (
    bookingId: string,
    customerId: string,
    customerName: string,
    customerProfileImg: string,
  ) => {
    try {
      const numberOfAcceptedBooking = listOfBookingFiltered.filter(
        item =>
          item.status === 'accepted' &&
          item.ifDoneStatus === undefined &&
          item.workerEmail === userData?.email,
      );

      console.log('numberOfAcceptedBooking: ', numberOfAcceptedBooking.length);

      if (numberOfAcceptedBooking.length >= 1) {
        return Alert.alert(
          'You already have 1 pending task/booking. Please complete to accept another booking.',
        );
      }

      setLoadingBookingStatus(true);
      setLoadingIfDoneStatus(true);

      await createConversationIfNotExists(
        userData?.id || '',
        customerId,
        userData?.fullName || '',
        customerName,
        userData?.imageUrl || '',
        customerProfileImg,
      );

      const bookingRef = doc(FIREBASE_DB, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'accepted',
        workerEmail: userData?.email,
      });

      Alert.alert('Booking Accepted', 'The booking has been accepted.');
      await refreshBookings();
      setLoadingBookingStatus(false);
      setLoadingIfDoneStatus(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to accept the booking.');
      setLoadingBookingStatus(false);
      setLoadingIfDoneStatus(false);
      console.error('Failed to accept booking: ', error);
    }
  };

  const handlePress = (bookingId: string) => {
    setBookingId(bookingId);
    setModalVisible(true);
  };

  const renderBookingItem = ({item}: {item: BookingInterface}) => {
    return (
      <View style={styles.bookingContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.serviceName}>{item.specificService}</Text>
          <Text style={styles.customerName}>Customer: {item.customerName}</Text>
          <Text style={styles.location}>
            Location: {item.barangay?.name}, {item.city?.name},{' '}
            {item.province?.name}
          </Text>
          {item.serviceAmountPaid ? (
            <Text style={styles.location}>
              Amount Paid: {item.serviceAmountPaid}
            </Text>
          ) : null}
          <Text style={styles.additionalDetail}>
            Additional Details: {item.additionalDetail}
          </Text>
          {item.rating ? (
            <StarRatingDisplay
              rating={item.rating}
              starSize={30}
              color="#FFD700"
            />
          ) : null}
          <Text style={styles.date}>
            Date: {item.createdAt?.toDate().toLocaleString()}
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.acceptButton,
              item.status === 'accepted' ? {backgroundColor: '#ccc'} : null,
            ]}
            onPress={() =>
              handleAcceptBooking(
                item.id,
                item.customerId,
                item.customerName,
                item.customerProfileImg,
              )
            }
            disabled={loadingBookingStatus || item.status === 'accepted'}>
            <Text style={styles.buttonText}>
              {loadingBookingStatus
                ? 'Please wait..'
                : item.status === 'accepted'
                ? 'Accepted'
                : 'Accept'}
            </Text>
          </TouchableOpacity>

          {item.status === 'accepted' && item.ifDoneStatus === undefined ? (
            <TouchableOpacity
              style={[
                styles.ifDoneButton,
                item.ifDoneStatus === 'done' ? {backgroundColor: '#ccc'} : null,
              ]}
              onPress={() => handlePress(item.id)}
              disabled={loadingIfDoneStatus || item.ifDoneStatus === 'done'}>
              <Text style={styles.buttonText}>
                {loadingBookingStatus
                  ? 'Please wait..'
                  : item.ifDoneStatus === 'done'
                  ? 'Done'
                  : 'Click to done'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Bookings</Text>
      <FlatList
        data={listOfBookingFiltered}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  list: {
    paddingBottom: 20,
  },
  bookingContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    flex: 1,
    marginRight: 15,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  customerName: {
    fontSize: 16,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  additionalDetail: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  btnContainer: {
    gap: 15,
  },
  acceptButton: {
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  ifDoneButton: {
    alignItems: 'center',
    backgroundColor: '#FFBF00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    textTransform: 'capitalize',
    color: '#fff',
    fontWeight: 'bold',
  },
});
