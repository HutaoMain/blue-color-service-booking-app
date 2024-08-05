import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BottomTabNavigation from "./BottomTabNavigation";
import useAuthStore from "../zustand/AuthStore";
import AuthStackNavigation from "./AuthStackNavigation";

const RootNavigation = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <NavigationContainer>
      {user ? <BottomTabNavigation /> : <AuthStackNavigation />}
    </NavigationContainer>
  );
};

export default RootNavigation;
