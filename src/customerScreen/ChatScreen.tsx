import { useCallback, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages: IMessage[]) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}
