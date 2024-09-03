import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import useFetchUserDocument from '../utilities/useFetchUserDocument';

export default function UserDocumentDisplay() {
  const {data} = useFetchUserDocument();

  const getFileName = (url: string) => {
    if (!url) return 'Not uploaded';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickDocumentContainer}>
        <Text style={styles.label}>Licenses:</Text>
        <TouchableOpacity style={styles.pickDocumentBtn}>
          <Text style={styles.label}>
            {data?.licenseUrl ? getFileName(data.licenseUrl) : 'Not uploaded'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickDocumentContainer}>
        <Text style={styles.label}>Certificates:</Text>
        <TouchableOpacity style={styles.pickDocumentBtn}>
          <Text style={styles.label}>
            {data?.certificateUrl
              ? getFileName(data.certificateUrl)
              : 'Not uploaded'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickDocumentContainer}>
        <Text style={styles.label}>Valid ID:</Text>
        {data?.validIdUrl ? (
          <Image
            source={{uri: data.validIdUrl}}
            style={styles.validIdImage}
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity style={styles.pickDocumentBtn}>
            <Text style={styles.label}>Not uploaded</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pickDocumentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '90%',
    marginVertical: 5,
  },
  pickDocumentBtn: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validIdImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  submitButton: {
    width: '90%',
    height: 40,
    backgroundColor: '#1971E1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  label: {
    color: 'black',
  },
});
