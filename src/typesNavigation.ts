import { NativeStackScreenProps } from "@react-navigation/native-stack";

export interface ChildrenInterface {
  children: React.ReactNode;
}

export type HomeStackNavigationType = {
  HomeScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  FillUpScreen: {
    category: string;
  };
};

export type HomeStackNavigationProps = NativeStackScreenProps<
  HomeStackNavigationType,
  "FillUpScreen"
>;
