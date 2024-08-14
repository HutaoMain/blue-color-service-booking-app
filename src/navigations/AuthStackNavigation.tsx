import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkerServiceSelectionScreen from "../screens/workerScreen/WorkerServiceSelectionScreen";
import { AuthStackNavigationType } from "../typesNavigation";
import LoginScreen from "../screens/customerScreen/LoginScreen";
import RegistrationScreen from "../screens/customerScreen/RegisterScreen";

const AuthStackNavigation = () => {
  const AuthStack = createNativeStackNavigator<AuthStackNavigationType>();

  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="RegisterScreen"
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="WorkerServiceSelectionScreen"
        component={WorkerServiceSelectionScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigation;
