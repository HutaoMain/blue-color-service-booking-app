import {useState, useCallback, useEffect} from 'react';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {FIREBASE_DB} from '../firebaseConfig';
import {ConversationInterface} from '../types';

export const useFetchConversations = (userId: string) => {
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    [],
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchConversations = useCallback(async () => {
    setRefreshing(true);
    const conversationsList: ConversationInterface[] = [];
    const q = query(
      collection(FIREBASE_DB, 'conversations'),
      where('participants', 'array-contains', userId),
    );

    try {
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (data.participants.includes(userId)) {
          const messagesQuery = query(
            collection(FIREBASE_DB, `conversations/${doc.id}/messages`),
            where('senderId', '!=', userId),
            where('unread', '==', true),
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          const unreadCount = messagesSnapshot.size;

          conversationsList.push({
            conversationId: doc.id,
            participants: data.participants,
            lastMessage: data.lastMessage,
            lastMessageTimestamp: data.lastMessageTimestamp,
            conversationName: data.conversationName,
            conversationImageUrl: data.conversationImageUrl,
            createdAt: data.createdAt,
            unreadCount: unreadCount,
          });
        }
      }
      setConversations(conversationsList);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {conversations, fetchConversations, refreshing};
};
