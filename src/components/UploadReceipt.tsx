import React, {useCallback, useEffect, useState} from 'react';
import useDocumentPicker from '../utilities/useDocumentPicker';
import {cloudinaryUserName} from '../env';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FIREBASE_DB} from '../firebaseConfig';
import {doc, updateDoc} from 'firebase/firestore';
import axios from 'axios';

interface props {
  bookingId: string;
}

export default function UploadReceipt({bookingId}: props) {
  const {validId, pickValidId} = useDocumentPicker();

  const [loading, setLoading] = useState<boolean>(false);
  const [cloudinaryImageUrl, setCloduinaryImageUrl] = useState<string>('');

  const uploadFile = useCallback(
    async (file: {uri: string; name: string}, type: string) => {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: 'application/pdf',
        name: file.name,
      } as any);
      formData.append('upload_preset', 'upload');

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryUserName}/auto/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok for ${type}`);
        }

        const data = await response.json();
        console.log(`${type} upload successful:`, data.secure_url);
        return data.secure_url;
      } catch (error) {
        console.error(`Error uploading ${type}:`, error);
        Alert.alert(`Error uploading ${type}`, 'Please try again.');
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    const uploadFiles = async () => {
      if (validId?.uri) {
        const validIdUrl = await uploadFile(validId, 'Receipt');
        if (validIdUrl) setCloduinaryImageUrl(validIdUrl);
      }
    };

    uploadFiles();
  }, [validId, uploadFile]);

  const submit = async () => {
    if (!cloudinaryImageUrl) {
      Alert.alert('Please upload your license, certificate, and valid ID');
      return;
    }

    setLoading(true);
    try {
      const bookingRef = doc(FIREBASE_DB, 'bookings', bookingId);
      await updateDoc(bookingRef, {receiptImageUrl: cloudinaryImageUrl});

      Alert.alert('Success', 'Successfully uploaded your receipt.');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log((err?.response?.data).error);
        Alert.alert('Error', 'Failed to submit receipt. Please try again.');
      } else {
        console.error('An unexpected error occurred', err);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.pickDocumentContainer}>
      <TouchableOpacity style={styles.pickDocumentBtn} onPress={pickValidId}>
        <Text style={styles.label}>
          {validId ? validId.name : 'Upload Receipt'}{' '}
          {/* String should be reusable */}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={submit}
        disabled={loading}>
        <Text style={styles.submitButtonText}>
          {loading ? 'Please wait...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pickDocumentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 5,
    marginTop: 15,
    gap: 3,
  },
  pickDocumentBtn: {
    height: 40,
    width: 200,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'black',
  },
  submitButton: {
    width: 200,
    height: 40,
    backgroundColor: '#1971E1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
