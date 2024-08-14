import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WorkerRegistrationNavigationType } from "../typesNavigation";
import WorkerServiceSelectionScreen from "../screens/workerScreen/WorkerServiceSelectionScreen";
import RegistrationScreen from "../screens/customerScreen/RegisterScreen";

const WorkerRegistrationStackNavigation = () => {
  const WorkerRegistrationStack =
    createNativeStackNavigator<WorkerRegistrationNavigationType>();

  return (
    <WorkerRegistrationStack.Navigator>
      <WorkerRegistrationStack.Screen
        name="RegisterScreen"
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <WorkerRegistrationStack.Screen
        name="WorkerServiceSelectionScreen"
        component={WorkerServiceSelectionScreen}
        options={{ headerShown: false }}
      />
    </WorkerRegistrationStack.Navigator>
  );
};

export default WorkerRegistrationStackNavigation;
