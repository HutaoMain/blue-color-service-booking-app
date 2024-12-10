import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {
  HomeStackNavigationProps,
  ReminderScreenProps,
} from '../../typesNavigation';
import useFetchUserData from '../../utilities/useFetchUserData';
import {doc, updateDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebaseConfig';
import {useNavigation} from '@react-navigation/native';

export default function ReminderScreen({route}: ReminderScreenProps) {
  const {handleSubmit, message, bookingId} = route.params;

  const navigate = useNavigation<HomeStackNavigationProps['navigation']>();

  console.log('bookingId:  ', bookingId);

  const [notes, setNotes] = useState<string>('');
  const [amountToBePaid, setAmountToBePaid] = useState<string>('');
  const [loadingIfDoneStatus, setLoadingIfDoneStatus] =
    useState<boolean>(false);

  const {userData: data} = useFetchUserData();

  const handleConfirm = () => {
    handleSubmit();
  };

  const handleUpdateIfDoneStatus = async () => {
    setLoadingIfDoneStatus(true);
    try {
      const bookingRef = doc(FIREBASE_DB, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        ifDoneStatus: 'done',
        serviceAmountPaid: parseFloat(amountToBePaid),
      });

      setLoadingIfDoneStatus(false);
      Alert.alert('Congratulations! The work is done.');
      navigate.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.serviceSelectedContainer}>
        {data?.role === 'customer' ? (
          <>
            <Text style={styles.serviceSelectedTitle}>Service Selected</Text>

            <View style={styles.serviceSelectedContent}>
              <View>
                <Text style={styles.text}>General Checkup</Text>
                <Text style={styles.text}>Initial Inspection</Text>
              </View>
              <View>
                <Text style={styles.text}>Service Charge</Text>
                <Text style={styles.serviceCharge}>₱ 150</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.serviceSelectedContent}>
              <TextInput
                placeholderTextColor="black"
                style={{color: 'black', justifyContent: 'flex-start'}}
                multiline
                numberOfLines={20}
                placeholder="Please enter notes and final cost"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </>
        )}
      </View>
      {data?.role === 'worker' ? (
        <>
          <Text style={styles.modalTitle}>Amount to be paid By customer:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amountToBePaid}
            onChangeText={setAmountToBePaid}
          />
        </>
      ) : null}
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
        {data?.role === 'customer' ? (
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Submit Booking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateIfDoneStatus}>
            <Text style={styles.buttonText}>
              {loadingIfDoneStatus ? 'Please wait..' : 'Done'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  serviceSelectedContainer: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    marginBottom: 16,
  },
  serviceSelectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
    backgroundColor: '#EDEDED',
    color: 'black',
  },
  serviceSelectedContent: {
    justifyContent: 'space-between',
    backgroundColor: '#EDEDED',
    padding: 12,
  },
  serviceCharge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    color: 'black',
    textAlign: 'center',
  },
  text: {
    color: 'black',
  },
  button: {
    backgroundColor: '#0A7A35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
});
