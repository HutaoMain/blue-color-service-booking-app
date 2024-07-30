import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: "https://via.placeholder.com/100" }}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileGreeting}>Hello,</Text>
          <Text style={styles.profileStatus}>Unverified</Text>
        </View>
      </View>

      <Text style={styles.servicesTitle}>Services</Text>
      <Text style={styles.servicesDescription}>
        You must need to verify your account first to use our services. Go to
        profile to unlock this features.
      </Text>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="user" size={50} color="black" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="history" size={50} color="black" />
          <Text style={styles.menuText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="contact-support" size={24} color="black" />
          <Text style={styles.menuText}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image
            style={styles.menuIcon}
            source={{ uri: "https://via.placeholder.com/50" }}
          />
          <Text style={styles.menuText}>Start Job</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image
            style={styles.menuIcon}
            source={{ uri: "https://via.placeholder.com/50" }}
          />
          <Text style={styles.menuText}>FAQ's</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image
            style={styles.menuIcon}
            source={{ uri: "https://via.placeholder.com/50" }}
          />
          <Text style={styles.menuText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.newsTitle}>News</Text>
      <Text style={styles.newsContent}>No news for today!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  profileTextContainer: {
    marginLeft: 20,
  },
  profileGreeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileStatus: {
    fontSize: 18,
    color: "#888",
  },
  servicesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  servicesDescription: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  menuIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  newsContent: {
    fontSize: 16,
    color: "#888",
  },
});
