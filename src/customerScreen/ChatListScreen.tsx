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
import useFetchUserData from "../utilities/useFetchUserData";

const ChatListScreen = () => {
  const { userData } = useFetchUserData();

  const [chats, setChats] = useState<ConversationInterface[]>([]);

  const navigation = useNavigation<ChatStackNavigationProps["navigation"]>();

  useEffect(() => {
    const fetchChats = async () => {
      const q = query(collection(FIREBASE_DB, "chats"));
      const querySnapshot = await getDocs(q);

      const chatsData: ConversationInterface[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chatsData.push({
          id: doc.id,
          user1Id: data.user1Id,
          user2Id: data.user2Id,
          user1FullName: data.user1FullName,
          user2FullName: data.user2FullName,
          user1ImageUrl: data.user1ImageUrl,
          user2ImageUrl: data.user2ImageUrl,
          lastMessage: data.lastMessage,
          createdAt: data.createdAt,
          read: data.read,
          unreadCount: data.unreadCount,
        });
      });
      setChats(chatsData);
    };

    fetchChats();
  }, []);

  const handleChatPress = (user2: string) => {
    navigation.navigate("ChatScreen", { id: user2 });
  };

  console.log(userData?.id);

  const renderItem = ({ item }: { item: ConversationInterface }) => {
    const isCurrentUserUser1 = item.user1Id === userData?.id;
    const chatPartnerName = isCurrentUserUser1
      ? item.user2FullName
      : item.user1FullName;
    const chatPartnerImage = isCurrentUserUser1
      ? item.user2ImageUrl
      : item.user1ImageUrl;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          handleChatPress(isCurrentUserUser1 ? item.user2Id : item.user1Id)
        }
      >
        <Image source={{ uri: chatPartnerImage }} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.chatName}>{chatPartnerName}</Text>
          <Text style={styles.lastMessage}>
            {item.lastMessage.startsWith(userData?.id || "")
              ? `You: ${item.lastMessage.slice(
                  userData?.id ? userData?.id.length : 1 + 2
                )}`
              : item.lastMessage}
          </Text>
        </View>
        <View style={styles.timeUnreadCountContainer}>
          <Text style={styles.time}>
            {moment(item.createdAt?.toDate())
              .local()
              .format("YYYY-MM-DD hh:mm A")}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadCountContainer}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
    alignItems: "flex-end",
  },
  unreadCountContainer: {
    backgroundColor: "#f00",
    borderRadius: 12,
    padding: 4,
    minWidth: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
  },
});

export default ChatListScreen;
