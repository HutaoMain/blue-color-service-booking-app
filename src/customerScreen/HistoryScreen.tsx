import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { BookingInterface } from "../types";
import moment from "moment";
import useFetchListOfBookings from "../utilities/useFetchListOfBookings";
import { useState } from "react";
import Navbar from "../components/Navbar";
import useFetchUserData from "../utilities/useFetchUserData";

export default function HistoryScreen() {
  const { ListOfBooking, refreshBookings } = useFetchListOfBookings({});

  const { userData } = useFetchUserData();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return styles.acceptedStatus;
      case "pending":
        return styles.pendingStatus;
      case "cancelled":
        return styles.cancelledStatus;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: BookingInterface }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.categoryService}>{item.categoryService}</Text>
      <Text style={styles.specificService}>{item.specificService}</Text>
      <Text style={styles.location}>
        {item.region.name}, {item.province.name}, {item.city.name},{" "}
        {item.barangay.name}
      </Text>
      <Text style={styles.additionalDetail}>{item.additionalDetail}</Text>
      <Text style={[styles.status, getStatusStyle(item.status)]}>
        Status: {item.status}
      </Text>
      <Text style={styles.createdAt}>
        Created At:{" "}
        {moment(item.createdAt?.toDate()).local().format("YYYY-MM-DD hh:mm A")}
      </Text>
    </View>
  );

  return (
    <>
      <Navbar
        title="Booking History"
        profileImageUrl={
          userData
            ? userData.imageUrl
            : "../../assets/Profile_avatar_placeholder_large.png"
        }
      />
      <View style={styles.container}>
        <FlatList
          data={ListOfBooking}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  categoryService: {
    fontSize: 16,
    fontWeight: "bold",
  },
  specificService: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  additionalDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    width: 150,
    padding: 10,
    borderRadius: 10,
    textTransform: "capitalize",
  },
  createdAt: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  acceptedStatus: {
    backgroundColor: "lightgreen",
  },
  pendingStatus: {
    backgroundColor: "yellow",
  },
  cancelledStatus: {
    backgroundColor: "red",
  },
});
