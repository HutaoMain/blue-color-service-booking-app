import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { ApplicantListNavigationProps } from "../../typesNavigation";
import { Button } from "react-native-paper";
import * as FileSystem from "expo-file-system";

interface DownloadFromUrlInterface {
  url: string;
  fileName: string;
}

export default function ViewApplicantDocuments({
  route,
}: ApplicantListNavigationProps) {
  const {
    certificateUrl,
    certificateFileName,
    email,
    licenseUrl,
    licenseFileName,
    validIdUrl,
  } = route.params;

  const downloadFromUrl = async ({
    url,
    fileName,
  }: DownloadFromUrlInterface) => {
    const result = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + fileName
    );
    console.log("result: ", result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Worker Email: {email}</Text>

      <Text style={styles.label}>Certificate: {certificateFileName}</Text>
      <Button
        style={styles.btn}
        onPress={() =>
          downloadFromUrl({
            url: certificateUrl,
            fileName: certificateFileName,
          })
        }
      >
        Download Certificate
      </Button>

      <Text style={styles.label}>License: {licenseFileName}</Text>
      <Button
        style={styles.btn}
        onPress={() =>
          downloadFromUrl({
            url: licenseUrl,
            fileName: licenseFileName,
          })
        }
      >
        Download License
      </Button>
      <Text style={styles.label}>Valid ID: </Text>
      <Image
        source={{ uri: validIdUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 16,
  },
  btn: {
    marginTop: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
});
