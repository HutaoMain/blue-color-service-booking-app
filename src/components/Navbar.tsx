import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { bluegreen, yellowLabel } from "../reusbaleVariables";

interface NavbarInterface {
  title: string;
  profileImageUrl: string;
}

export default function Navbar({ title, profileImageUrl }: NavbarInterface) {
  return (
    <View style={styles.navbarContainer}>
      <Text style={styles.title}>{title}</Text>
      {profileImageUrl && (
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 90,
    backgroundColor: bluegreen,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 75,
    borderWidth: 3,
    borderColor: yellowLabel,
    marginRight: 12,
  },
});
