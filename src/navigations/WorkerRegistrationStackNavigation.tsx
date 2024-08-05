import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../customerScreen/RegisterScreen";
import { WorkerRegistrationNavigationType } from "../typesNavigation";
import WorkerServiceSelectionScreen from "../workerScreen/WorkerServiceSelectionScreen";

const WorkerRegistrationStackNavigation = () => {
  const WorkerRegistrationStack =
    createNativeStackNavigator<WorkerRegistrationNavigationType>();

  return (
    <WorkerRegistrationStack.Navigator>
      <WorkerRegistrationStack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
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
