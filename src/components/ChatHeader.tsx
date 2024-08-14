import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface ChatHeaderInterface {
  name: string;
  imageUrl: string;
}

const ChatHeader = ({ name, imageUrl }: ChatHeaderInterface) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Image source={{ uri: imageUrl }} style={styles.profileImage} />
      <Text style={styles.chatName}>{name}</Text>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
