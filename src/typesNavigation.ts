import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AuthStackNavigationType = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  WorkerServiceSelectionScreen: undefined;
};

// Home Stack Navigation
export type HomeStackNavigationType = {
  HomeScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  FillUpScreen: {
    category: string;
  };
  ListOfBookingScreen: undefined;
  HistoryScreen: undefined;
};
export type HomeStackNavigationProps = NativeStackScreenProps<
  HomeStackNavigationType,
  "FillUpScreen"
>;

// Worker Registration Stack Navigation
export type WorkerRegistrationNavigationType = {
  RegisterScreen: undefined;
  WorkerServiceSelectionScreen: undefined;
};
export type WorkerRegistrationNavigationProps = NativeStackScreenProps<
  WorkerRegistrationNavigationType,
  "WorkerServiceSelectionScreen"
>;

// Chat Stack Navigation
export type ChatStackNavigationType = {
  ChatListScreen: undefined;
  ChatScreen: {
    id: string;
    participants: string[];
    conversationName: string[];
    conversationImageUrl: string[];
  };
};
export type ChatStackNavigationProps = NativeStackScreenProps<
  ChatStackNavigationType,
  "ChatScreen"
>;
