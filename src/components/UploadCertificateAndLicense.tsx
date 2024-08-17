import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Navbar from "./Navbar";
import useFetchUserData from "../utilities/useFetchUserData";
import { cloudinaryUserName } from "../env";
import axios from "axios";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import useDocumentPicker from "../utilities/useDocumentPicker";

export default function UploadCertificateAndLicense() {
  const { userData } = useFetchUserData();

  const {
    licenses,
    certificates,
    validId,
    pickLicense,
    pickCertificate,
    pickValidId,
    resetDocuments,
  } = useDocumentPicker();

  const [loading, setLoading] = useState<boolean>(false);
  const [cloudinaryLicenseUrl, setCloudinaryLicenseUrl] = useState<string>("");
  const [cloudinaryCertificateUrl, setCloudinaryCertificateUrl] =
    useState<string>("");
  const [cloudinaryValidIdUrl, setCloudinaryValidIdUrl] = useState<string>("");

  const uploadFile = useCallback(
    async (file: { uri: string; name: string }, type: string) => {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "application/pdf",
        name: file.name,
      } as any);
      formData.append("upload_preset", "upload");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryUserName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok for ${type}`);
        }

        const data = await response.json();
        console.log(`${type} upload successful:`, data.secure_url);
        return data.secure_url;
      } catch (error) {
        console.error(`Error uploading ${type}:`, error);
        Alert.alert(`Error uploading ${type}`, "Please try again.");
        return null;
      }
    },
    []
  );

  useEffect(() => {
    const uploadFiles = async () => {
      if (licenses?.uri) {
        const licenseUrl = await uploadFile(licenses, "License");
        if (licenseUrl) setCloudinaryLicenseUrl(licenseUrl);
      }
      if (certificates?.uri) {
        const certificateUrl = await uploadFile(certificates, "Certificate");
        if (certificateUrl) setCloudinaryCertificateUrl(certificateUrl);
      }
      if (validId?.uri) {
        const validIdUrl = await uploadFile(validId, "ValidID");
        if (validIdUrl) setCloudinaryValidIdUrl(validIdUrl);
      }
    };

    uploadFiles();
  }, [licenses, certificates, validId, uploadFile]);

  const resetState = useCallback(() => {
    resetDocuments();
    setCloudinaryLicenseUrl("");
    setCloudinaryCertificateUrl("");
    setCloudinaryValidIdUrl("");
  }, [resetDocuments]);

  const submit = async () => {
    if (
      !cloudinaryLicenseUrl ||
      !cloudinaryCertificateUrl ||
      !cloudinaryValidIdUrl
    ) {
      Alert.alert("Please upload your license, certificate, and valid ID");
      return;
    }

    setLoading(true);
    try {
      const data = {
        licenseUrl: cloudinaryLicenseUrl,
        licenseFileName: licenses?.name,
        certificateUrl: cloudinaryCertificateUrl,
        certificateFileName: certificates?.name,
        validIdUrl: cloudinaryValidIdUrl,
        validIdFileName: validId?.name,
        email: userData?.email,
        updatedAt: new Date().toISOString(),
      };

      const q = query(
        collection(FIREBASE_DB, "documents"),
        where("email", "==", userData?.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, data);
        console.log("Document updated successfully");
      } else {
        await addDoc(collection(FIREBASE_DB, "documents"), {
          ...data,
          createdAt: new Date().toISOString(),
        });
        console.log("New document added successfully");
      }

      Alert.alert(
        "Success",
        "Successfully uploaded your documents. Please wait for the admin to approve your application."
      );
      resetState();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log((err?.response?.data).error);
        Alert.alert("Error", "Failed to submit documents. Please try again.");
      } else {
        console.error("An unexpected error occurred", err);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickDocumentContainer}>
        <Text>Licenses:</Text>
        <TouchableOpacity style={styles.pickDocumentBtn} onPress={pickLicense}>
          <Text>{licenses ? licenses.name : "Pick your Document"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickDocumentContainer}>
        <Text>Certificates:</Text>
        <TouchableOpacity
          style={styles.pickDocumentBtn}
          onPress={pickCertificate}
        >
          <Text>{certificates ? certificates.name : "Pick your Document"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickDocumentContainer}>
        <Text>Valid ID:</Text>
        <TouchableOpacity style={styles.pickDocumentBtn} onPress={pickValidId}>
          <Text>{validId ? validId.name : "Pick your Valid ID"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Please wait..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  pickDocumentContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "90%",
    marginVertical: 5,
  },
  pickDocumentBtn: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    width: "90%",
    height: 40,
    backgroundColor: "#1971E1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});
