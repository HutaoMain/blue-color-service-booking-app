import React, {useEffect} from 'react';
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
import WorkerList from '../screens/adminScreen/WorkerList';
import TransactionHistory from '../screens/workerScreen/TransactionHistory';
import {Badge} from 'react-native-paper';
import {useFetchConversations} from '../utilities/useFetchConversations';
import {StyleSheet, View} from 'react-native';
import {useTabRefresh} from '../utilities/TabRefresherProvider';

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  const {userData} = useFetchUserData();

  const {conversations, fetchConversations} = useFetchConversations(
    userData?.id || '',
  );

  const {refreshTab} = useTabRefresh();

  useEffect(() => {
    fetchConversations();
  }, [refreshTab]);

  const conversationUnreadMessages = conversations.filter(
    item => item.unreadCount > 0,
  );

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
            return (
              <View>
                <Icon name={iconName} size={size} color={color} />
                {conversationUnreadMessages.length > 0 && (
                  <Badge style={styles.badge} size={18}>
                    {conversationUnreadMessages.length}
                  </Badge>
                )}
              </View>
            );
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
          } else if (route.name === 'Worker List') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'archive' : 'archive-outline';
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
        <Tab.Screen
          name="Chat"
          component={ChatStackNavigation}
          options={{headerShown: false}}
        />
      )}

      {userData?.role === 'customer' && (
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{headerShown: false}}
        />
      )}

      {userData?.role === 'worker' && (
        <>
          <Tab.Screen
            name="Documents"
            component={DocumentUploadScreen}
            options={{headerShown: false}}
          />

          <Tab.Screen
            name="Transactions"
            component={TransactionHistory}
            options={{headerShown: false}}
          />
        </>
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

          <Tab.Screen
            name="Worker List"
            component={WorkerList}
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

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -10,
    top: -3,
    backgroundColor: 'red', // Badge background color
  },
});
