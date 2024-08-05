import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../customerScreen/HomeScreen";
import { HomeStackNavigationType } from "../typesNavigation";
import FillUpScreen from "../customerScreen/FillUpScreen";
import ListOfBookingScreen from "../workerScreen/ListOfBookingScreen";
import HistoryScreen from "../customerScreen/HistoryScreen";

const HomeStackNavigation = () => {
  const HomeStack = createNativeStackNavigator<HomeStackNavigationType>();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="FillUpScreen"
        component={FillUpScreen}
        options={{ title: "Service Booking" }}
      />
      <HomeStack.Screen
        name="ListOfBookingScreen"
        component={ListOfBookingScreen}
        options={{ title: "List of available Bookings" }}
      />
      <HomeStack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{ title: "Booking History" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigation;
