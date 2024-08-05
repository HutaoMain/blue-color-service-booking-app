import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { HomeStackNavigationProps } from "../typesNavigation";
import { FIREBASE_AUTH } from "../firebaseConfig";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import useAuthStore from "../zustand/AuthStore";

export default function LoginScreen() {
  const navigation = useNavigation<HomeStackNavigationProps["navigation"]>();

  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [forgotPassLoading, setForgotPassLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setLoginLoading(false);
      setUser(email);
    } catch (error) {
      setLoginLoading(false);
      Alert.alert("Email or password is incorrect!");
      console.log(error);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPassLoading(true);
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert("Please check your email to reset your password.");
      setForgotPassLoading(false);
    } catch (error) {
      setForgotPassLoading(false);
      Alert.alert("Not able to reset your password.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Home Maintenance Service</Text>
          <Text style={styles.subtitle}>
            Making <Text style={styles.highlight}>Home</Text> and {`\n`}
            <Text style={styles.highlight}>Hassle-Free</Text>.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>
              {loginLoading ? "Please wait.." : "Login"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>
              {forgotPassLoading ? "Please wait" : "Forgot password?"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={styles.signUpText}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  textContainer: {
    marginHorizontal: 40,
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 36,
    color: "#fff",
  },
  highlight: {
    color: "red",
    fontWeight: "bold",
  },
  inputContainer: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 15,
    color: "#000",
  },
  loginButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#1971E1",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  forgotPassword: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  signUpText: {
    fontSize: 16,
    color: "#fff",
  },
});
