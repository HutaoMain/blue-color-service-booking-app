import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { RadioButton, ToggleButton, Tooltip } from "react-native-paper";
import {
  createUserWithEmailAndPassword,
  // sendEmailVerification,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { HomeStackNavigationProps } from "../../typesNavigation";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";

export default function RegistrationScreen() {
  const customerNavigation =
    useNavigation<HomeStackNavigationProps["navigation"]>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isCustomer, setIsCustomer] = useState<string>("customer");
  const [fullName, setFullName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState<string>("");

  const usersCollectionRef = collection(FIREBASE_DB, "users");

  useEffect(() => {
    if (imageBase64) {
      let data = {
        file: imageBase64,
        upload_preset: "upload",
      };

      fetch("https://api.cloudinary.com/v1_1/alialcantara/image/upload", {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();
          console.log(data.secure_url);
          setImageUrl(data.secure_url);
          return data.secure_url;
        })
        .catch((err) => console.log(err));
    }
  }, [imageBase64]);

  const handleRegistration = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        Alert.alert("Password do not match");
      }

      // const userCredentials = await createUserWithEmailAndPassword(
      //   FIREBASE_AUTH,
      //   email,
      //   password
      // );

      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

      // const user = userCredentials.user;
      // await sendEmailVerification(user);

      await addDoc(usersCollectionRef, {
        email: email,
        fullName: fullName,
        imageUrl: imageUrl,
        gender: selectedGender,
        age: age,
        role: isCustomer ? "customer" : "worker",
        isWorkerApproved: false,
      });

      Alert.alert("Registration Completed!.");
      setLoading(false);
      setTimeout(() => {
        customerNavigation.navigate("LoginScreen");
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      let base64Img = `data:image/jpg;base64,${result.assets?.[0].base64}`;
      setImageBase64(base64Img);
    }
  };

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

        <ToggleButton.Row
          onValueChange={setIsCustomer}
          value={isCustomer}
          style={styles.toggleButtonRow}
        >
          <Tooltip title="Customer">
            <ToggleButton icon="account" value="customer" />
          </Tooltip>

          <Tooltip title="Worker">
            <ToggleButton icon="briefcase" value="worker" />
          </Tooltip>
        </ToggleButton.Row>

        <TextInput
          style={styles.input}
          placeholder="Full Name*"
          placeholderTextColor="#888"
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email*"
          placeholderTextColor="#888"
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password*"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password*"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setConfirmPassword}
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

        <TouchableOpacity onPress={pickImage} style={styles.selectImage}>
          <Text>
            {imageUrl
              ? "Image picked successfully"
              : "Pick a Profile Picture from camera roll"}
          </Text>
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
          {/* <Checkbox style={styles.checkbox} /> */}
          <Text style={styles.checkboxText}>
            By proceeding, I agree to the{" "}
            <Text style={styles.link}>Privacy Notice</Text> and{" "}
            <Text style={styles.link}>Terms & Conditions</Text>.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegistration}>
          <Text style={styles.buttonText}>
            {loading ? "Please wait..." : "Signup"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={styles.loginText}
            onPress={() => customerNavigation.navigate("LoginScreen")}
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
  toggleButtonRow: {
    marginBottom: 20,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  selectImage: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginBottom: 20,
  },
});
