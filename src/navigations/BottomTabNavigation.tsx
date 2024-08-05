import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeStackNavigation from "./HomeStackNavigation";
import ProfileScreen from "../customerScreen/ProfileScreen";
import ChatScreen from "../customerScreen/ChatScreen";
import HistoryScreen from "../customerScreen/HistoryScreen";

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName: any;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "AI Chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "History") {
            iconName = focused ? "list" : "list-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? "blue" : "black"}
            />
          );
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: "white",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigation}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AI Chat"
        component={ChatScreen}
        options={{ headerTitle: "Chatbot" }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerTitle: "Booking History" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: "Profile" }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
