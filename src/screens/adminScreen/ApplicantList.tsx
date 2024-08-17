import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import { useFetchAllDocuments } from "../../utilities/useFetchAllDocuments";

import { Button, Menu } from "react-native-paper";
import { useFetchAllUsers } from "../../utilities/useFetchAllUsers";

export default function ApplicantList() {
  const [visible, setVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const closeMenu = () => setVisible(false);

  const { documents, refreshDocuments } = useFetchAllDocuments();
  const { users } = useFetchAllUsers();

  const openMenu = (documentId: string) => {
    setSelectedDocument(documentId);
    setVisible(true);
  };

  const handleStatusChange = async (
    email: string,
    isWorkerApproved: boolean
  ) => {
    try {
      // Query the users collection to find the document with the matching email
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      // Assuming there's only one document per email
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].ref; // Get the reference to the document
        await updateDoc(userDoc, { isWorkerApproved: isWorkerApproved });
        console.log("User status updated successfully.");
        Alert.alert("User status updated successfully.");
        refreshDocuments(); // Optional: refresh document list after status update
      } else {
        console.log("No user found with the given email.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };
  const handleSelect = (value: boolean) => {
    const document = documents.find((doc) => doc.id === selectedDocument);
    if (document) {
      handleStatusChange(document.email, value);
    }
    closeMenu();
  };

  return (
    <ScrollView>
      {documents.map((document) => {
        const user = users.find((u) => u.email === document.email);
        return (
          <View key={document.id} style={styles.card}>
            <Text>Email: {document.email}</Text>
            <Text>Certificate: {document.certificate}</Text>
            <Text>License: {document.license}</Text>
            <Menu
              visible={visible && selectedDocument === document.id}
              onDismiss={closeMenu}
              anchor={
                <Button onPress={() => openMenu(document.id)}>
                  {user?.isWorkerApproved ? "Approved" : "Not Approved"}
                </Button>
              }
            >
              <Menu.Item onPress={() => handleSelect(true)} title="Approve" />
              <Menu.Item onPress={() => handleSelect(false)} title="Reject" />
            </Menu>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
});
