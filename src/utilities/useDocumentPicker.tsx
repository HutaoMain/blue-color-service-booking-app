import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useState, useCallback } from "react";

interface Document {
  name: string;
  type: string;
  uri: string;
}

const useDocumentPicker = () => {
  const [licenses, setLicenses] = useState<Document | null>(null);
  const [certificates, setCertificates] = useState<Document | null>(null);
  const [validId, setValidId] = useState<Document | null>(null);

  const pickDocument = async (setFile: (file: Document | null) => void) => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!docRes.canceled) {
        setFile({
          name: docRes.assets[0].name,
          type: docRes.assets[0].mimeType || "application/pdf",
          uri: docRes.assets[0].uri,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
      setFile(null);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setValidId({
          name: "valid_id.jpg",
          type: "image/jpeg",
          uri: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
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
