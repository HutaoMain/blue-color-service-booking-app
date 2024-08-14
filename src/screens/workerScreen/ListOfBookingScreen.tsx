import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import useFetchListOfBookings from "../../utilities/useFetchListOfBookings";
import useFetchUserData from "../../utilities/useFetchUserData";
import { createConversationIfNotExists } from "../../reusbaleVariables";
import { BookingInterface } from "../../types";

export default function ListOfBookingScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { userData, refresh } = useFetchUserData();
  const { ListOfBooking, refreshBookings } = useFetchListOfBookings({});

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    await refresh();
    setRefreshing(false);
  };

  const handleAcceptBooking = async (
    bookingId: string,
    customerId: string,
    customerName: string,
    customerProfileImg: string
  ) => {
    try {
      setLoading(true);

      await createConversationIfNotExists(
        userData?.id || "",
        customerId,
        userData?.fullName || "",
        customerName,
        userData?.imageUrl || "",
        customerProfileImg
      );

      const bookingRef = doc(FIREBASE_DB, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: "accepted",
      });

      Alert.alert("Booking Accepted", "The booking has been accepted.");
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to accept the booking.");
      setLoading(false);
      console.error("Failed to accept booking: ", error);
    }
  };

  const renderBookingItem = ({ item }: { item: BookingInterface }) => (
    <View style={styles.bookingContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.serviceName}>{item.specificService}</Text>
        <Text style={styles.customerName}>Customer: {item.customerName}</Text>
        <Text style={styles.location}>
          Location: {item.barangay.name}, {item.city.name}, {item.province.name}
        </Text>
        <Text style={styles.additionalDetail}>
          Additional Details: {item.additionalDetail}
        </Text>
        <Text style={styles.date}>
          Date: {item.createdAt?.toDate().toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.acceptButton,
          item.status === "accepted" && { backgroundColor: "#ccc" },
        ]}
        onPress={() =>
          handleAcceptBooking(
            item.id,
            item.customerId,
            item.customerName,
            item.customerProfileImg
          )
        }
        disabled={loading || item.status === "accepted"}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Please wait.."
            : item.status === "accepted"
            ? "Accepted"
            : "Accept"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Bookings</Text>
      <FlatList
        data={ListOfBooking}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  bookingContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
    marginRight: 15,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  customerName: {
    fontSize: 16,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  additionalDetail: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    textTransform: "capitalize",
    color: "#fff",
    fontWeight: "bold",
  },
});
