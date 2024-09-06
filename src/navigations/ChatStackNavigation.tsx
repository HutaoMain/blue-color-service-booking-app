import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ChatStackNavigationType} from '../typesNavigation';
import ChatListScreen from '../screens/customerScreen/ChatListScreen';
import ChatScreen from '../screens/customerScreen/ChatScreen';

const ChatStackNavigation = () => {
  const ChatStack = createNativeStackNavigator<ChatStackNavigationType>();

  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{headerShown: false}}
      />
      <ChatStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{headerShown: false}}
      />
    </ChatStack.Navigator>
  );
};

export default ChatStackNavigation;
