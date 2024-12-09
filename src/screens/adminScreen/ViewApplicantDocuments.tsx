import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import PDF from 'react-native-pdf';
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

  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

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

  const viewDocument = async (url: string) => {
    try {
      if (url.toLowerCase().endsWith('.pdf')) {
        setCurrentPdfUrl(url);
        setPdfModalVisible(true);
      } else {
        Alert.alert('For PDF Only.');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  console.log('URL: ', currentPdfUrl);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Worker Email: {email}</Text>

      <Text style={styles.label}>Certificate: {certificateFileName}</Text>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.btn, styles.downloadBtn]}
          onPress={() =>
            downloadFromUrl({
              url: certificateUrl,
              fileName: certificateFileName,
            })
          }>
          Download
        </Button>
        <Button
          style={[styles.btn, styles.viewBtn]}
          onPress={() => viewDocument(certificateUrl)}>
          View
        </Button>
      </View>

      <Text style={styles.label}>License: {licenseFileName}</Text>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.btn, styles.downloadBtn]}
          onPress={() =>
            downloadFromUrl({
              url: licenseUrl,
              fileName: licenseFileName,
            })
          }>
          Download
        </Button>
        <Button
          style={[styles.btn, styles.viewBtn]}
          onPress={() => viewDocument(licenseUrl)}>
          View
        </Button>
      </View>

      <Text style={styles.label}>Valid ID: </Text>
      <Image
        source={{uri: validIdUrl}}
        style={styles.image}
        resizeMode="contain"
      />

      {/* PDF Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={pdfModalVisible}
        onRequestClose={() => setPdfModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Button
            style={styles.closeButton}
            onPress={() => setPdfModalVisible(false)}>
            Close
          </Button>
          <PDF
            trustAllCerts={false}
            source={{uri: currentPdfUrl, cache: true}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        </View>
      </Modal>
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
    color: 'black',
    fontSize: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  btn: {
    width: '48%',
    borderRadius: 5,
    borderWidth: 1,
  },
  downloadBtn: {
    borderColor: 'green',
    backgroundColor: 'rgba(0,255,0,0.1)',
  },
  viewBtn: {
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.1)',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: 10,
    borderColor: 'red',
  },
});
