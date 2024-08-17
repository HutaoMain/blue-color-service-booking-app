import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApplicantListNavigationType } from "../typesNavigation";
import ApplicantList from "../screens/adminScreen/ApplicantList";
import ViewApplicantDocuments from "../screens/adminScreen/ViewApplicantDocuments";

const ApplicantListStackNavigation = () => {
  const ApplicantListStack =
    createNativeStackNavigator<ApplicantListNavigationType>();

  return (
    <ApplicantListStack.Navigator>
      <ApplicantListStack.Screen
        name="ApplicantList"
        component={ApplicantList}
        options={{ headerShown: false }}
      />
      <ApplicantListStack.Screen
        name="ViewApplicantDocuments"
        component={ViewApplicantDocuments}
        options={{ headerShown: false }}
      />
    </ApplicantListStack.Navigator>
  );
};

export default ApplicantListStackNavigation;
