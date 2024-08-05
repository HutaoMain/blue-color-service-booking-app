import { View, Text } from "react-native";
import React from "react";
import useFetchListOfBookings from "../utilities/useFetchListOfBookings";

export default function ListOfBookingScreen() {
  const listOfBookings = useFetchListOfBookings();

  return (
    <View>
      <View>
        {listOfBookings?.map((item) => (
          <Text key={item.id}>{item.specificService}</Text>
        ))}
      </View>
    </View>
  );
}
