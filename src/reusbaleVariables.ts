import { doc, setDoc, Timestamp } from "firebase/firestore";
import { FIREBASE_DB } from "./firebaseConfig";

export const bluegreen = "#498176";
export const yellowLabel = "#EDB232";

export const createConversationIfNotExists = async (
  currentUserId: string,
  anotherUserId: string
) => {
  const conversationId = getConversationId(currentUserId, anotherUserId);
  await setDoc(doc(FIREBASE_DB, "conversation", conversationId), {
    conversationId,
    createdAt: Timestamp.fromDate(new Date()),
  });
};

export const getConversationId = (
  currentUserId: string,
  anotherUserId: string
) => {
  const sortedIds = [currentUserId, anotherUserId].sort();
  return sortedIds.join("-");
};
