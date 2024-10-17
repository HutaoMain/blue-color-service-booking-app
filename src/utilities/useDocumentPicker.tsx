import React, {useState, useCallback} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {ImageInterface} from '../types';

const useDocumentPicker = () => {
  const [licenses, setLicenses] = useState<ImageInterface | null>(null);
  const [certificates, setCertificates] = useState<ImageInterface | null>(null);
  const [validId, setValidId] = useState<ImageInterface | null>(null);

  const pickDocument = async (
    setFile: (file: ImageInterface | null) => void,
  ) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (result) {
        setFile({
          name: result[0].name || '',
          type: result[0].type || 'application/pdf',
          uri: result[0].uri,
        });
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Error picking document:', error);
      }
      setFile(null);
    }
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        setValidId({
          name: result.assets[0].fileName || 'valid_id.jpg',
          type: result.assets[0].type || 'image/jpeg',
          uri: result.assets[0].uri || '',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setValidId(null);
    }
  };

  const resetDocuments = useCallback(() => {
    setLicenses(null);
    setCertificates(null);
    setValidId(null);
  }, []);

  return {
    licenses,
    certificates,
    validId,
    pickLicense: () => pickDocument(setLicenses),
    pickCertificate: () => pickDocument(setCertificates),
    pickValidId: pickImage,
    resetDocuments,
  };
};

export default useDocumentPicker;
