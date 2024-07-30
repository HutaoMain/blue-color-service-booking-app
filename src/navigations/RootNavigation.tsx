import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import HomeStackNavigation from "./HomeStackNavigation";
// import AuthStackNavigation from "./AuthStackNavigation";
// import useAuthStore from "../zustand/AuthStore";
// import BottomTabNavigation from "./BottomTabNavigation";

const RootNavigation = () => {
  // const user = useAuthStore((state) => state.user);
  return (
    <NavigationContainer>
      {/* {user ? <BottomTabNavigation /> : <AuthStackNavigation />} */}
      <HomeStackNavigation />
    </NavigationContainer>
  );
};

export default RootNavigation;
