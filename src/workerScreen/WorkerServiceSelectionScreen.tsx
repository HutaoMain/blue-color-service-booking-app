import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { HomeStackNavigationProps } from "../typesNavigation";

const services = [
  "Electrical Work",
  "Plumbing",
  "Carpentry",
  "Cleaning",
  "Gardening",
  "Painting",
  "Pest Control",
  "Home Security",
];

export default function WorkerServiceSelectionScreen() {
  const navigation = useNavigation<HomeStackNavigationProps["navigation"]>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...prevSelected, service]
    );
  };

  const handleSubmit = () => {
    // Handle the submit logic, e.g., saving the selected services to Firebase
    alert("Selected Services: " + selectedServices.join(", "));
    // Navigate to another screen or go back
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Services You Can Offer</Text>
      {services.map((service) => (
        <View key={service} style={styles.serviceItem}>
          <Checkbox
            status={
              selectedServices.includes(service) ? "checked" : "unchecked"
            }
            onPress={() => handleServiceToggle(service)}
          />
          <Text style={styles.serviceText}>{service}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  serviceText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
