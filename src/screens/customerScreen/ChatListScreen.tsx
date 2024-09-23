import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import useFetchUserData from '../../utilities/useFetchUserData';
import {useFetchConversations} from '../../utilities/useFetchConversations';
import {ChatStackNavigationProps} from '../../typesNavigation';
import {ConversationInterface} from '../../types';
import Navbar from '../../components/Navbar';
import ProfileModal from '../../components/ProfileModal';

const ChatListScreen = () => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedWorkerEmail, setSelectedWorkerEmail] = useState<string | null>(
    null,
  );

  const {userData} = useFetchUserData();

  const {conversations, fetchConversations, refreshing} = useFetchConversations(
    userData?.id || '',
  );

  console.log(conversations);

  const navigation = useNavigation<ChatStackNavigationProps['navigation']>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchConversations();
    });

    return unsubscribe;
  }, [navigation, fetchConversations]);

  const handleChatPress = (conversation: ConversationInterface) => {
    conversation.participants[0] === userData?.id;
    console.log('conversationId', conversation.conversationId);
    navigation.navigate('ChatScreen', {
      id: conversation.conversationId,
      participants: conversation.participants,
      conversationName: conversation.conversationName,
      conversationImageUrl: conversation.conversationImageUrl,
    });
  };

  const handleViewWorker = (workerEmail: string) => {
    setSelectedWorkerEmail(workerEmail);
    setProfileModalVisible(true);
  };

  const renderItem = ({item}: {item: ConversationInterface}) => {
    const isCurrentUserUser1 = item.participants[0] === userData?.id;
    const chatPartnerUserId = isCurrentUserUser1
      ? item.participants[1]
      : item.participants[0];
    const chatPartnerName = isCurrentUserUser1
      ? item.conversationName[1]
      : item.conversationName[0];
    const chatPartnerImage = isCurrentUserUser1
      ? item.conversationImageUrl[1]
      : item.conversationImageUrl[0];

    return (
      <View style={styles.itemContainer}>
        {userData?.role === 'customer' ? (
          <TouchableOpacity onPress={() => handleViewWorker(chatPartnerUserId)}>
            <Image
              source={{uri: chatPartnerImage}}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        ) : (
          <Image source={{uri: chatPartnerImage}} style={styles.profileImage} />
        )}
        <TouchableOpacity
          onPress={() => handleChatPress(item)}
          style={{flexDirection: 'row', marginRight: 60}}>
          <View style={styles.textContainer}>
            <Text style={styles.chatName}>{chatPartnerName}</Text>
          </View>
          <View style={styles.timeUnreadCountContainer}>
            <Text style={styles.time}>
              {moment(item.lastMessageTimestamp?.toDate())
                .local()
                .format('YYYY-MM-DD hh:mm A')}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Navbar
        title="Chat"
        profileImageUrl={
          userData
            ? userData.imageUrl
            : '../../assets/Profile_avatar_placeholder_large.png'
        }
      />
      <View style={styles.container}>
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={item => item.conversationId}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchConversations}
            />
          }
        />
      </View>
      {selectedWorkerEmail && (
        <ProfileModal
          visible={isProfileModalVisible}
          workerEmail={selectedWorkerEmail}
          onClose={() => setProfileModalVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  chatName: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  timeUnreadCountContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadCountContainer: {
    marginTop: 5,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  // unreadCount: {
  //   color: '#fff',
  //   fontSize: 12,
  // },

  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 5,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatListScreen;
