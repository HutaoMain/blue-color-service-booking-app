import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import useFetchUserData from "../utilities/useFetchUserData";
import useAuthStore from "../zustand/AuthStore";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import HorizontalLine from "../components/HorizontalLine";

export default function ProfileScreen() {
  const { userData: data, refresh } = useFetchUserData();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const clearUser = useAuthStore((state) => state.clearUser);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        Alert.alert("Successfully logout!");
        clearUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.coverPhotoContainer}>
          <Image
            source={{
              uri: data?.imageUrl,
            }}
            style={styles.imageUrl}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>{data?.fullName}</Text>
          </View>
          <Text style={styles.profileEmail}>{data?.email}</Text>
        </View>

        <HorizontalLine />

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Basic Info</Text>

          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Age: </Text>
            <Text style={styles.infoValue}>{data?.age}</Text>
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Gender: </Text>
            <Text style={[styles.infoValue, { textTransform: "capitalize" }]}>
              {data?.gender}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
  coverPhotoContainer: {
    alignItems: "center",
  },
  profileName: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  imageUrl: {
    width: 150,
    height: 150,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  profileEmail: {
    fontSize: 16,
    color: "gray",
  },
  infoContainer: {
    width: "100%",
  },
  infoTitle: {
    fontSize: 18,
    color: "#303234",
    paddingBottom: 10,
  },
  infoColumn: {
    flex: 1,
    paddingBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    marginBottom: 10,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
