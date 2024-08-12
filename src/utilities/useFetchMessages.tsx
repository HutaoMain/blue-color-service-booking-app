import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import { MessageInterface } from "../types";

export const fetchMessages = async (conversationId: string) => {
  const messages: MessageInterface[] = [];
  const messagesRef = collection(
    FIREBASE_DB,
    "conversations",
    conversationId,
    "messages"
  );

  const querySnapshot = await getDocs(messagesRef);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    messages.push({
      messageId: doc.id,
      senderId: data.senderId,
      text: data.text,
      timestamp: data.timestamp,
      type: data.type,
      status: data.status,
    });
  });

  return messages;
};
