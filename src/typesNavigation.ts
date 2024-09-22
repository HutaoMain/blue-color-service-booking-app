import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Timestamp} from 'firebase/firestore';

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
  ListOfBookingsAdminScreen: undefined;
  ReportsListScreen: undefined;
  WorkerList: undefined;
  TransactionHistory: undefined;
};

export type HomeStackNavigationProps = NativeStackScreenProps<
  HomeStackNavigationType,
  'FillUpScreen'
>;

// Worker Registration Stack Navigation
export type WorkerRegistrationNavigationType = {
  RegisterScreen: undefined;
  WorkerServiceSelectionScreen: undefined;
};
export type WorkerRegistrationNavigationProps = NativeStackScreenProps<
  WorkerRegistrationNavigationType,
  'WorkerServiceSelectionScreen'
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
  'ChatScreen'
>;

// ApplicantList Stack Navigation
export type ApplicantListNavigationType = {
  ApplicantList: undefined;
  ViewApplicantDocuments: {
    id: string;
    email: string;
    certificateUrl: string;
    certificateFileName: string;
    licenseUrl: string;
    licenseFileName: string;
    validIdUrl: string;
    validIdFileName: string;
    createdAt: Timestamp;
  };
};
export type ApplicantListNavigationProps = NativeStackScreenProps<
  ApplicantListNavigationType,
  'ViewApplicantDocuments'
>;
