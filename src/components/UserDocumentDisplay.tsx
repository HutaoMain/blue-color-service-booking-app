import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import useFetchUserDocument from "../utilities/useFetchUserDocument";

export default function UserDocumentDisplay() {
  const { data } = useFetchUserDocument();

  const getFileName = (url: string) => {
    if (!url) return "Not uploaded";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickDocumentContainer}>
        <Text>License:</Text>
        <TouchableOpacity style={styles.pickDocumentBtn}>
          <Text>
            {data?.license ? getFileName(data.license) : "Not uploaded"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickDocumentContainer}>
        <Text>Certificate:</Text>
        <TouchableOpacity style={styles.pickDocumentBtn}>
          <Text>
            {data?.certificate ? getFileName(data.certificate) : "Not uploaded"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickDocumentContainer}>
        <Text>Valid ID:</Text>
        {data?.validId ? (
          <Image
            source={{ uri: data.validId }}
            style={styles.validIdImage}
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity style={styles.pickDocumentBtn}>
            <Text>Not uploaded</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  pickDocumentContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "90%",
    marginVertical: 5,
  },
  pickDocumentBtn: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  validIdImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  submitButton: {
    width: "90%",
    height: 40,
    backgroundColor: "#1971E1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});
