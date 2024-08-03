import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { HomeStackNavigationProps } from "../typesNavigation";

export default function RegistrationScreen() {
  const navigation = useNavigation<HomeStackNavigationProps["navigation"]>();

  const [age, setAge] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("male");

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>New user registration</Text>
            <Text style={styles.subtitle}>Tell us about yourself.</Text>
          </View>
          <Image
            source={require("../../assets/registrationImage.png")}
            style={styles.registrationImage}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="First name*"
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Last name*"
          placeholderTextColor="#888"
        />

        <View style={styles.phoneContainer}>
          <View style={styles.phoneCodeContainer}>
            <Text style={styles.phoneCodeText}>+63</Text>
          </View>
          <TextInput
            style={[styles.input, styles.phoneNumberInput]}
            placeholder="Mobile number*"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Gender:</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            value="male"
            status={selectedGender === "male" ? "checked" : "unchecked"}
            onPress={() => setSelectedGender("male")}
          />
          <Text style={styles.radioText}>Male</Text>
          <RadioButton
            value="female"
            status={selectedGender === "female" ? "checked" : "unchecked"}
            onPress={() => setSelectedGender("female")}
          />
          <Text style={styles.radioText}>Female</Text>
        </View>

        <View style={styles.checkboxContainer}>
          {/* <Checkbox style={styles.checkbox} /> */}
          <Text style={styles.checkboxText}>
            By proceeding, I agree to the{" "}
            <Text style={styles.link}>Privacy Notice</Text> and{" "}
            <Text style={styles.link}>Terms & Conditions</Text>.
          </Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={styles.loginText}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            Already have an account?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  registrationImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  input: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  phoneCodeContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    marginBottom: 15,
  },
  phoneCodeText: {
    fontSize: 16,
    color: "#000",
  },
  phoneNumberInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: "#888",
  },
  link: {
    color: "#1971E1",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    backgroundColor: "#1971E1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#1971E1",
    fontSize: 14,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  radioText: {
    marginRight: 20,
  },
});
