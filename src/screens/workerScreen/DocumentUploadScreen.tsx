import { ScrollView, RefreshControl } from "react-native";
import React, { useState } from "react";
import UploadCertificateAndLicense from "../../components/UploadCertificateAndLicense";
import Navbar from "../../components/Navbar";
import useFetchUserData from "../../utilities/useFetchUserData";
import useFetchUserDocument from "../../utilities/useFetchUserDocument";
import UserDocumentDisplay from "../../components/UserDocumentDisplay";

export default function DocumentUploadScreen() {
  const { userData } = useFetchUserData();
  const { data, refreshDocument } = useFetchUserDocument();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDocument();
    setRefreshing(false);
  };

  console.log("data from user document: ", data);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Navbar
        profileImageUrl={
          userData
            ? userData.imageUrl
            : "../../assets/Profile_avatar_placeholder_large.png"
        }
        title="Documents"
      />
      {data ? <UserDocumentDisplay /> : <UploadCertificateAndLicense />}
    </ScrollView>
  );
}
