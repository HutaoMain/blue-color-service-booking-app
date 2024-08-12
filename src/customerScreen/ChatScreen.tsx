import { useEffect, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import useFetchUserData from "../utilities/useFetchUserData";

export default function ChatScreen({ route }: { route: any }) {
  const { id } = route.params; // conversationId

  const { userData } = useFetchUserData();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>("");

  console.log(messages);

  useEffect(() => {
    if (!id || !userData?.id) return;

    const conversationRef = doc(FIREBASE_DB, "conversations", id);
    const messagesRef = collection(conversationRef, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().timestamp.toDate(),
        user: {
          _id: doc.data().senderId,
          name: doc.data().senderName,
          avatar: doc.data().senderImageUrl,
        },
      }));
      setMessages(allMessages);
    });

    return () => unsub();
  }, [id, userData?.id]);

  const handleSendMessage = async (newMessages: IMessage[] = []) => {
    if (newMessages.length === 0) return;

    try {
      const conversationRef = doc(FIREBASE_DB, "conversations", id);
      const messagesRef = collection(conversationRef, "messages");

      const newMessage = newMessages[0];
      setText(""); // Clear the input

      await addDoc(messagesRef, {
        senderId: userData?.id,
        text: newMessage.text,
        senderName: userData?.fullName,
        senderImageUrl: userData?.imageUrl,
        timestamp: Timestamp.fromDate(new Date()),
        type: "text",
        status: "sent",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages: IMessage[]) => handleSendMessage(messages)}
      user={{
        _id: userData?.id || "",
        name: userData?.fullName || "User",
        avatar: userData?.imageUrl || "https://placeimg.com/140/140/any",
      }}
      text={text} // Bind the text input
      onInputTextChanged={(text: string) => setText(text)} // Handle input text change
    />
  );
}
