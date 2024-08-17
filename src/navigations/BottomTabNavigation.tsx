import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigation from "./HomeStackNavigation";
import { bluegreen } from "../reusbaleVariables";
import ChatStackNavigation from "./ChatStackNavigation";
import useFetchUserData from "../utilities/useFetchUserData";
import HistoryScreen from "../screens/customerScreen/HistoryScreen";
import ProfileScreen from "../screens/customerScreen/ProfileScreen";
import DocumentUploadScreen from "../screens/workerScreen/DocumentUploadScreen";
import ApplicantList from "../screens/adminScreen/ApplicantList";

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  const { userData } = useFetchUserData();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName: any;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "History") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Documents") {
            iconName = focused ? "document-text" : "document-text-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? bluegreen : "black"}
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
        name="Chat"
        component={ChatStackNavigation}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />

      {userData?.role === "worker" && (
        <Tab.Screen
          name="Documents"
          component={DocumentUploadScreen}
          options={{ headerShown: false }}
        />
      )}

      {userData?.role === "admin" && (
        <Tab.Screen
          name="Applicant List"
          component={ApplicantList}
          options={{ headerShown: false }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
