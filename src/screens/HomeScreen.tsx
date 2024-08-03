import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import PagerView from "react-native-pager-view";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HomeStackNavigationProps } from "../typesNavigation";

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
        <IconComponent name={item.iconName} size={40} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTugpmZJVjP8Rr0VEk7C-HEPk8_gJ8v8cs6jnHxiMfid_cM0XK8",
            }}
            style={styles.headerImage}
          />
        </View>
        <Text style={styles.greeting}>Hi, Jawad</Text>
        <Text style={styles.title}>What service do you need?</Text>
      </View>

      <Text style={styles.categoryTitle}>Category</Text>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.promotionTitle}>Promotions</Text>
      <PagerView style={styles.container} initialPage={0}>
        <View style={styles.page} key="1">
          <Text>First page</Text>
          <Text>Swipe ➡️</Text>
        </View>
        <View style={styles.page} key="2">
          <Text>Second page</Text>
        </View>
        <View style={styles.page} key="3">
          <Text>Third page</Text>
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 16,
    height: 200,
    backgroundColor: "#F1F9FE",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  headerImage: {
    width: 75,
    height: 75,
    resizeMode: "cover",
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "#ffffff",
  },
  greeting: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  getStartButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF7B29",
    borderRadius: 25,
  },
  getStartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  categoryTitle: {
    marginTop: 20,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#EAF3FF",
    borderRadius: 15,
  },
  categoryButtonText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  promotionTitle: {
    marginTop: 20,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
});
