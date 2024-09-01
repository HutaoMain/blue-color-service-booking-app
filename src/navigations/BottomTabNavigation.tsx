import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStackNavigation from './HomeStackNavigation';
import {bluegreen} from '../reusbaleVariables';
import ChatStackNavigation from './ChatStackNavigation';
import useFetchUserData from '../utilities/useFetchUserData';
import HistoryScreen from '../screens/customerScreen/HistoryScreen';
import ProfileScreen from '../screens/customerScreen/ProfileScreen';
import DocumentUploadScreen from '../screens/workerScreen/DocumentUploadScreen';
import ApplicantListStackNavigation from './ApplicantListStackNavigation';
import ListOfBookingsAdminScreen from '../screens/adminScreen/ListOfBookingsAdminScreen';
import ReportsListScreen from '../screens/adminScreen/ReportsListScreen';

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  const {userData} = useFetchUserData();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Documents') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Applicant List') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'List Of Bookings') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bug' : 'bug-outline';
          } else {
            iconName = 'ios-information-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: bluegreen,
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          height: 60,
          backgroundColor: 'white',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigation}
        options={{headerShown: false}}
      />

      {userData?.role !== 'admin' && (
        <>
          <Tab.Screen
            name="Chat"
            component={ChatStackNavigation}
            options={{headerShown: false}}
          />

          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{headerShown: false}}
          />
        </>
      )}

      {userData?.role === 'worker' && (
        <Tab.Screen
          name="Documents"
          component={DocumentUploadScreen}
          options={{headerShown: false}}
        />
      )}

      {userData?.role === 'admin' && (
        <>
          <Tab.Screen
            name="List Of Bookings"
            component={ListOfBookingsAdminScreen}
            options={{headerShown: false}}
          />

          <Tab.Screen
            name="Applicant List"
            component={ApplicantListStackNavigation}
            options={{headerShown: false}}
          />

          <Tab.Screen
            name="Reports"
            component={ReportsListScreen}
            options={{headerShown: false}}
          />
        </>
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
