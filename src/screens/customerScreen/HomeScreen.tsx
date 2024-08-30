import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
// import PagerView from "react-native-pager-view";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { HomeStackNavigationProps } from "../../typesNavigation";
import useFetchUserData from "../../utilities/useFetchUserData";
import { ashBlack, bluegreen, yellowLabel } from "../../reusbaleVariables";
import Navbar from "../../components/Navbar";

interface CategoryItem {
  name: string;
  iconFrom: any;
  iconName: string;
}

const categories: CategoryItem[] = [
  {
    name: "Plumbing",
    iconFrom: MaterialIcons,
    iconName: "plumbing",
  },
  {
    name: "General Handyman",
    iconFrom: MaterialIcons,
    iconName: "handyman",
  },
  {
    name: "Cleaning & Laundry",
    iconFrom: MaterialIcons,
    iconName: "cleaning-services",
  },
  {
    name: "Electrical",
    iconFrom: MaterialIcons,
    iconName: "electrical-services",
  },
  {
    name: "Painting",
    iconFrom: FontAwesome6,
    iconName: "paint-roller",
  },
  {
    name: "Electronics and Gadgets",
    iconFrom: Entypo,
    iconName: "tablet-mobile-combo",
  },
  {
    name: "Appliances Repair and Services",
    iconFrom: MaterialCommunityIcons,
    iconName: "washing-machine",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeStackNavigationProps["navigation"]>();

  const { userData, refresh } = useFetchUserData();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => {
    const IconComponent = item.iconFrom;
    return (
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() =>
          navigation.navigate("FillUpScreen", { category: item.name })
        }
      >
        <Text style={styles.categoryButtonText}>{item.name}</Text>
        <IconComponent name={item.iconName} size={40} color={yellowLabel} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerContainer}>
        <Navbar
          title=""
          profileImageUrl={
            userData
              ? userData.imageUrl
              : "../../assets/Profile_avatar_placeholder_large.png"
          }
        />
        <Text style={styles.greeting}>
          Hi,<Text style={styles.name}> {userData?.fullName}</Text>
        </Text>
        {userData?.role === "customer" ? (
          <Text style={styles.title}> What service do you need?</Text>
        ) : userData?.role === "worker" ? (
          <Text style={styles.title}> Get your customer's booking</Text>
        ) : (
          <></>
        )}
      </View>

      {userData?.role === "customer" ? (
        <>
          <Text style={styles.categoryTitle}>Category</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.categoryList}
            showsHorizontalScrollIndicator={false}
          />
        </>
      ) : userData?.role === "worker" ? (
        <View style={{ marginBottom: 170, alignItems: "center" }}>
          <Text style={styles.categoryTitle}>
            List of existing client bookings:
          </Text>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              {
                width: "90%",
                backgroundColor: userData.isWorkerApproved ? bluegreen : "gray",
              },
            ]}
            onPress={() => navigation.navigate("ListOfBookingScreen")}
            disabled={!userData.isWorkerApproved}
          >
            <Text style={styles.categoryButtonText}>Go to Client Bookings</Text>
            <MaterialIcons name="cleaning-services" size={40} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}

      {/* <View>
        <Text style={styles.promotionTitle}>Promotions</Text>
        <PagerView initialPage={0}>
          <View style={styles.page} key="1">
            <Image
              source={require("../../assets/banner1.jpg")}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                marginHorizontal: 20,
              }}
            />
          </View>
          <View style={styles.page} key="2">
            <Image
              source={require("../../assets/banner2.jpg")}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                marginHorizontal: 20,
              }}
            />
          </View>
        </PagerView> 
      </View>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  headerContainer: {
    padding: 16,
    height: 200,
    backgroundColor: bluegreen,
  },
  greeting: {
    fontSize: 18,
    color: ashBlack,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: yellowLabel,
    marginBottom: 10,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  categoryTitle: {
    marginTop: 20,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: ashBlack,
  },
  categoryList: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  categoryButton: {
    marginRight: 10,
    padding: 10,
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
  },
  categoryButtonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  // promotionTitle: {
  //   marginTop: 20,
  //   marginLeft: 16,
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: ashBlack,
  // },
  // page: {
  //   marginTop: -100,
  // },
});
