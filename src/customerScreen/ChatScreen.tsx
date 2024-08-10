import { useEffect, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import useFetchUserData from "../utilities/useFetchUserData";
import {
  createConversationIfNotExists,
  getConversationId,
} from "../reusbaleVariables";

export default function ChatScreen({ route }: { route: any }) {
  const { id } = route.params;

  const { userData } = useFetchUserData();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (!id || !userData?.id) return;

    createConversationIfNotExists(userData.id, id);

    const roomId = getConversationId(userData.id, id);
    const docRef = doc(FIREBASE_DB, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        user: {
          _id: doc.data().userId,
          name: doc.data().senderName,
          avatar: doc.data().imageUrl,
        },
      }));
      setMessages(allMessages);
    });

    return () => unsub();
  }, [id, userData?.id]);

  const handleSendMessage = async (newMessages: IMessage[] = []) => {
    if (newMessages.length === 0) return;

    try {
      const roomId = getConversationId(userData?.id || "", id);
      const docRef = doc(FIREBASE_DB, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");

      const newMessage = newMessages[0];
      setText(""); // Clear the input

      await addDoc(messagesRef, {
        userId: userData?.id,
        text: newMessage.text,
        imageUrl: userData?.imageUrl,
        senderName: userData?.fullName,
        createdAt: Timestamp.fromDate(new Date()),
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
