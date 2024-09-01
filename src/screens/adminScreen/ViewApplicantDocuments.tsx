import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {Button} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import {ApplicantListNavigationProps} from '../../typesNavigation';

interface DownloadFromUrlInterface {
  url: string;
  fileName: string;
}

export default function ViewApplicantDocuments({
  route,
}: ApplicantListNavigationProps) {
  const {
    certificateUrl,
    certificateFileName,
    email,
    licenseUrl,
    licenseFileName,
    validIdUrl,
  } = route.params;

  const downloadFromUrl = async ({url, fileName}: DownloadFromUrlInterface) => {
    const {config, fs} = RNFetchBlob;
    let downloadDir = fs.dirs.DownloadDir;

    // On iOS, we need to use the document directory
    if (Platform.OS === 'ios') {
      downloadDir = fs.dirs.DocumentDir;
    }

    const filePath = `${downloadDir}/${fileName}`;

    try {
      const res = await config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading file...',
        },
        path: filePath,
      }).fetch('GET', url);

      console.log('File downloaded to:', res.path());
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Worker Email: {email}</Text>

      <Text style={styles.label}>Certificate: {certificateFileName}</Text>
      <Button
        style={styles.btn}
        onPress={() =>
          downloadFromUrl({
            url: certificateUrl,
            fileName: certificateFileName,
          })
        }>
        Download Certificate
      </Button>

      <Text style={styles.label}>License: {licenseFileName}</Text>
      <Button
        style={styles.btn}
        onPress={() =>
          downloadFromUrl({
            url: licenseUrl,
            fileName: licenseFileName,
          })
        }>
        Download License
      </Button>

      <Text style={styles.label}>Valid ID: </Text>
      <Image
        source={{uri: validIdUrl}}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
  btn: {
    marginTop: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});
