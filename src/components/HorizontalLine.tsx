import { View } from "react-native";
import React from "react";

export default function HorizontalLine() {
  return (
    <View
      style={{
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
        alignSelf: "stretch",
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
      }}
    />
  );
}
