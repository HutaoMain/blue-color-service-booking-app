import {useEffect, useState} from 'react';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import useFetchUserData from '../../utilities/useFetchUserData';
import {FIREBASE_DB} from '../../firebaseConfig';
import ChatHeader from '../../components/ChatHeader';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ChatInterface} from '../../types';
import {useTabRefresh} from '../../utilities/TabRefresherProvider';

export default function ChatScreen({route}: {route: any}) {
  const {id, participants, conversationName, conversationImageUrl} =
    route.params;

  const {triggerTabRefresh} = useTabRefresh();

  const {userData} = useFetchUserData();

  const [messages, setMessages] = useState<ChatInterface[]>([]);
  const [text, setText] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);

  const chatPartnerIndex = userData?.id === participants[0] ? 1 : 0;
  const chatPartnerName = conversationName[chatPartnerIndex];
  const chatPartnerImageUrl = conversationImageUrl[chatPartnerIndex];

  const markMessagesAsRead = async () => {
    const conversationRef = doc(FIREBASE_DB, 'conversations', id);
    const messagesRef = collection(conversationRef, 'messages');
    const q = query(
      messagesRef,
      where('senderId', '!=', userData?.id),
      where('unread', '==', true),
    );

    const unreadMessages = await getDocs(q);
    const batch = writeBatch(FIREBASE_DB);

    console.log('unreadMessages Count: ', unreadMessages.size);

    unreadMessages.forEach(doc => {
      batch.update(doc.ref, {unread: false});
    });

    await batch.commit();

    // Reset unread count for current user
    await updateDoc(conversationRef, {
      [`unreadCount.${userData?.id}`]: 0,
    });
  };

  useEffect(() => {
    if (!id || !userData?.id) return;

    const conversationRef = doc(FIREBASE_DB, 'conversations', id);
    const messagesRef = collection(conversationRef, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsub = onSnapshot(q, snapshot => {
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        timestamp: doc.data().timestamp,
        senderId: doc.data().senderId,
        senderName: doc.data().senderName,
        senderImageUrl: doc.data().senderImageUrl,
        unread: doc.data().unread,
      }));
      setMessages(allMessages);
    });

    markMessagesAsRead();
    triggerTabRefresh();

    return () => unsub();
  }, [userData?.id, loader]);

  const handleSendMessage = async () => {
    if (text.trim() === '') return;

    setLoader(true);

    try {
      const conversationRef = doc(FIREBASE_DB, 'conversations', id);
      const messagesRef = collection(conversationRef, 'messages');

      await addDoc(messagesRef, {
        senderId: userData?.id,
        text: text,
        senderName: userData?.fullName,
        senderImageUrl: userData?.imageUrl,
        timestamp: Timestamp.fromDate(new Date()),
        unread: true,
      });

      setText('');
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const renderMessage = ({item}: {item: ChatInterface}) => {
    const isCurrentUser = item.senderId === userData?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}>
        {!isCurrentUser ? (
          <Image source={{uri: chatPartnerImageUrl}} style={styles.avatar} />
        ) : null}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.userMessage : styles.otherMessage,
          ]}>
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.userMessageText : styles.otherMessageText,
            ]}>
            {item.text}
          </Text>
        </View>
        {isCurrentUser ? (
          <Image source={{uri: userData?.imageUrl}} style={styles.avatar} />
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ChatHeader name={chatPartnerName} imageUrl={chatPartnerImageUrl} />
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>
            {!loader ? 'Send' : 'Sending..'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    marginHorizontal: 10,
    gap: 7,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  otherMessage: {
    backgroundColor: '#E5E5EA',
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    color: 'black',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
