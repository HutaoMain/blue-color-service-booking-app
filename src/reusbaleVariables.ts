import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "./firebaseConfig";

export const bluegreen = "#498176";
export const yellowLabel = "#EDB232";

export const createConversationIfNotExists = async (
  workerId: string,
  customerId: string,
  workerName: string,
  customerName: string,
  workerImageUrl: string,
  customerImageUrl: string
) => {
  const conversationId = getConversationId(workerId, customerId);
  const conversationRef = doc(FIREBASE_DB, "conversations", conversationId);
  const conversationSnapshot = await getDoc(conversationRef);

  if (!conversationSnapshot.exists()) {
    const initialMessage = `Hi, I am ${workerName}. I am here to help with your request.`;

    // Create the conversation document
    await setDoc(conversationRef, {
      conversationId,
      participants: [workerId, customerId],
      lastMessage: initialMessage,
      lastMessageTimestamp: Timestamp.fromDate(new Date()),
      conversationName: [workerName, customerName],
      conversationImageUrl: [workerImageUrl, customerImageUrl],
      unreadCount: {
        [workerId]: 0,
        [customerId]: 1,
      },
      createdAt: Timestamp.fromDate(new Date()),
    });

    // Add the initial message to the messages subcollection
    const messagesRef = collection(conversationRef, "messages");
    await addDoc(messagesRef, {
      senderId: workerId,
      text: initialMessage,
      timestamp: Timestamp.fromDate(new Date()),
      type: "text",
      status: "sent",
    });
  }
};

export const getConversationId = (
  currentUserId: string,
  anotherUserId: string
) => {
  const sortedIds = [currentUserId, anotherUserId].sort();
  return sortedIds.join("-");
};
