import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BottomTabNavigation from "./BottomTabNavigation";

const RootNavigation = () => {
  // const user = useAuthStore((state) => state.user);
  return (
    <NavigationContainer>
      {/* {user ? <BottomTabNavigation /> : <AuthStackNavigation />} */}
      <BottomTabNavigation />
    </NavigationContainer>
  );
};

export default RootNavigation;
