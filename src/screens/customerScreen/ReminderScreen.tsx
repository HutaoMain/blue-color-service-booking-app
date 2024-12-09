import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {ReminderScreenProps} from '../../typesNavigation';
import useFetchUserData from '../../utilities/useFetchUserData';

export default function ReminderScreen({route}: ReminderScreenProps) {
  const {handleSubmit, message} = route.params;

  const {userData: data} = useFetchUserData();

  const handleConfirm = () => {
    handleSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.serviceSelectedContainer}>
        <Text style={styles.serviceSelectedTitle}>Service Selected</Text>
        <View style={styles.serviceSelectedContent}>
          <View>
            <Text style={styles.text}>General Checkup</Text>
            <Text style={styles.text}>Initial Inspection</Text>
          </View>
          <View style={styles.serviceChargeContainer}>
            <Text style={styles.text}>Service Charge</Text>
            <Text style={styles.serviceCharge}>₱ 150</Text>
          </View>
        </View>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>
            {data?.role === 'customer' ? 'Submit Booking' : 'Accept Booking'}
          </Text>
        </TouchableOpacity>
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

  serviceChargeContainer: {
    marginTop: 90,
  },
  serviceSelectedContent: {
    justifyContent: 'space-between',

    padding: 12,
    height: '40%',
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
});
