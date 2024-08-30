import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackNavigationType } from "../typesNavigation";
import ListOfBookingScreen from "../screens/workerScreen/ListOfBookingScreen";
import FillUpScreen from "../screens/customerScreen/FillUpScreen";
import HomeScreen from "../screens/customerScreen/HomeScreen";
import HistoryScreen from "../screens/customerScreen/HistoryScreen";
import ListOfBookingsAdminScreen from "../screens/adminScreen/ListOfBookingsAdminScreen";
import ReportsListScreen from "../screens/adminScreen/ReportsListScreen";

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
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{ title: "Booking History" }}
      />
      <HomeStack.Screen
        name="ListOfBookingsAdminScreen"
        component={ListOfBookingsAdminScreen}
        options={{ title: "Booking History" }}
      />
      <HomeStack.Screen
        name="ReportsListScreen"
        component={ReportsListScreen}
        options={{ title: "Booking History" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigation;
