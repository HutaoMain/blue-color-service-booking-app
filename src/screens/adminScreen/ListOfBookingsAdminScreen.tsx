import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import useFetchListOfBookings from '../../utilities/useFetchListOfBookings';
import {BookingInterface} from '../../types';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

export default function ListOfBookingsAdminScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {ListOfBooking, refreshBookings} = useFetchListOfBookings();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    setRefreshing(false);
  };

  const renderBookingItem = ({item}: {item: BookingInterface}) => (
    <View style={styles.bookingContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.serviceName}>{item.specificService}</Text>
        <Text style={styles.customerName}>Customer: {item.customerName}</Text>
        <Text style={styles.location}>
          Location: {item.barangay.name}, {item.city.name}, {item.province.name}
        </Text>
        {item.serviceAmountPaid ? (
          <>
            <Text style={styles.location}>Worker: {item.workerEmail}</Text>
            <Text style={styles.location}>
              Amount Paid: {item.serviceAmountPaid}
            </Text>
          </>
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
        ) : (
          <StarRatingDisplay rating={0} starSize={30} color="#FFD700" />
        )}

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={
              item.status === 'pending'
                ? [{backgroundColor: '#FFBF00'}, styles.statusButton]
                : item.status === 'cancelled'
                ? [{backgroundColor: 'red'}, styles.statusButton]
                : [{backgroundColor: '#28a745'}, styles.statusButton]
            }
            disabled={true}>
            <Text style={styles.buttonText}>{item.status}</Text>
          </TouchableOpacity>

          {item.ifDoneStatus === 'done' ? (
            <TouchableOpacity style={[styles.ifDoneButton]} disabled={true}>
              <Text style={styles.buttonText}>
                Work Status: {item.ifDoneStatus}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.date}>
          Date: {item.createdAt?.toDate().toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Bookings</Text>
      <FlatList
        data={ListOfBooking}
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
  statusButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  ifDoneButton: {
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  btnContainer: {
    marginTop: 10,
    gap: 15,
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
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
});
