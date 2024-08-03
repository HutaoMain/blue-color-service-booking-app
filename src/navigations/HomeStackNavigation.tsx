import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { HomeStackNavigationType } from "../typesNavigation";
import FillUpScreen from "../screens/FillUpScreen";

const HomeStackNavigation = () => {
  const HomeStack = createNativeStackNavigator<HomeStackNavigationType>();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <HomeStack.Screen
        name="FillUpScreen"
        component={FillUpScreen}
        options={{ title: "Service Booking" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigation;
