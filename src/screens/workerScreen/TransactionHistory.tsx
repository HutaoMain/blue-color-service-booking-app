import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import useFetchListOfBookingsWithFilter from '../../utilities/useFetchListOfBookingsWithFilter';
import useFetchUserData from '../../utilities/useFetchUserData';
import {BookingInterface} from '../../types';
import moment from 'moment';
import Navbar from '../../components/Navbar';
import {bluegreen} from '../../reusbaleVariables';
import {TextInput} from 'react-native';
import {doc, updateDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebaseConfig';

export default function TransactionHistory() {
  const {userData} = useFetchUserData();

  const [loadingBookingStatus, setLoadingBookingStatus] =
    useState<boolean>(false);
  const [loadingIfDoneStatus, setLoadingIfDoneStatus] =
    useState<boolean>(false);
  const [bookingId, setBookingId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceAmount, setServiceAmount] = useState('');

  const {ListOfBooking, refreshBookings} = useFetchListOfBookingsWithFilter({
    filterField: 'workerEmail',
    filterValue: userData?.email || '',
  });

  const listOfBookingsFiltered = ListOfBooking.filter(
    item => item.status === 'accepted',
  );

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleUpdateIfDoneStatus = async () => {
    setLoadingIfDoneStatus(true);
    try {
      const bookingRef = doc(FIREBASE_DB, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        ifDoneStatus: 'done',
        serviceAmountPaid: parseFloat(serviceAmount),
      });

      setLoadingIfDoneStatus(false);
      setModalVisible(false);
      setServiceAmount('');
      setBookingId('');
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = (bookingId: string) => {
    setBookingId(bookingId);
    setModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    setRefreshing(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setServiceAmount('');
  };

  const renderItem = ({item}: {item: BookingInterface}) => (
    // <View style={styles.itemContainer}>
    //   <Text style={styles.customerName}>{item.customerName}</Text>
    //   <Text style={styles.categoryService}>{item.categoryService}</Text>
    //   <Text style={styles.specificService}>{item.specificService}</Text>
    //   <Text style={styles.location}>
    //     {item.region.name}, {item.province.name}, {item.city.name},{' '}
    //     {item.barangay.name}
    //   </Text>
    //   <Text style={styles.additionalDetail}>{item.additionalDetail}</Text>
    //   <Text style={styles.additionalDetail}>
    //     Amount: PHP {item.serviceAmountPaid}.00
    //   </Text>

    //   <StarRatingDisplay rating={item.rating} starSize={30} color="#FFD700" />
    //   <Text style={[styles.status, styles.acceptedStatus]}>
    //     Status: {item.ifDoneStatus}
    //   </Text>
    //   <Text style={styles.createdAt}>
    //     Created At:{' '}
    //     {moment(item.createdAt?.toDate()).local().format('YYYY-MM-DD hh:mm A')}
    //   </Text>
    // </View>
    <View style={styles.itemContainer}>
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.categoryService}>{item.categoryService}</Text>
      <Text style={styles.specificService}>{item.specificService}</Text>
      <Text style={styles.location}>
        {item.region.name}, {item.province.name}, {item.city.name},{' '}
        {item.barangay.name}
      </Text>
      <Text style={styles.additionalDetail}>{item.additionalDetail}</Text>
      <Text style={styles.additionalDetail}>
        Amount: PHP {item.serviceAmountPaid}.00
      </Text>

      <StarRatingDisplay rating={item.rating} starSize={30} color="#FFD700" />
      <Text style={[styles.status, styles.acceptedStatus]}>
        Status: {item.status}
      </Text>

      {item.ifDoneStatus === 'done' ? (
        <Text style={[styles.status, styles.acceptedStatus]}>
          Work Status: {item.ifDoneStatus}
        </Text>
      ) : null}

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
      <Text style={styles.createdAt}>
        Created At:{' '}
        {moment(item.createdAt?.toDate()).local().format('YYYY-MM-DD hh:mm A')}
      </Text>
    </View>
  );

  return (
    <>
      <Navbar
        title="Transaction History"
        profileImageUrl={
          userData
            ? userData.imageUrl
            : '../../assets/Profile_avatar_placeholder_large.png'
        }
      />
      <View style={styles.container}>
        <FlatList
          data={listOfBookingsFiltered}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancel}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Amount Paid By Customer:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={serviceAmount}
                onChangeText={setServiceAmount}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleUpdateIfDoneStatus}
                  disabled={!serviceAmount || loadingIfDoneStatus}>
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  customerName: {
    marginBottom: 5,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginVertical: 5,
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    marginVertical: 10,
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
    backgroundColor: '#efc549',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  textInput: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
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
