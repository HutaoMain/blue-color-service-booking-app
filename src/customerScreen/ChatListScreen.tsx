import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { collection, getDocs, query } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_DB } from "../firebaseConfig";
import { ConversationInterface } from "../types";
import { ChatStackNavigationProps } from "../typesNavigation";
import moment from "moment";

const ChatListScreen = () => {
  const [chats, setChats] = useState<ConversationInterface[]>([]);
  const navigation = useNavigation<ChatStackNavigationProps["navigation"]>();

  console.log(chats.map((item) => item.id));

  useEffect(() => {
    const fetchChats = async () => {
      const q = query(collection(FIREBASE_DB, "conversation"));
      const querySnapshot = await getDocs(q);

      const chatsData: ConversationInterface[] = [];
      querySnapshot.forEach((doc) => {
        chatsData.push({
          id: doc.id,
          chatName: doc.data().chatName,
          lastMessage: doc.data().lastMessage,
          imageUrl: doc.data().imageUrl,
          createdAt: doc.data().createdAt,
        });
      });
      setChats(chatsData);
    };

    fetchChats();
  }, []);

  const handleChatPress = (chatId: string) => {
    navigation.navigate("ChatScreen", { id: chatId });
  };

  const renderItem = ({ item }: { item: ConversationInterface }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleChatPress(item.id)}
    >
      <Image source={{ uri: item.user2ImageUrl }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.chatName}>{item.user2}</Text>
        {/*condition that if the user1 is equivalent to the current user then render user2 viseversa */}
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <View style={styles.timeUnreadCountContainer}>
        <Text style={styles.time}>
          {moment(item.createdAt?.toDate())
            .local()
            .format("YYYY-MM-DD hh:mm A")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    height: 80,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  timeUnreadCountContainer: {
    height: 80,
    paddingBottom: 15,
    justifyContent: "space-around",
  },
});

export default ChatListScreen;
