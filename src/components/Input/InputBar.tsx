import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

const InputBar: React.FC<any> = ({ value, onChangeText }) => (
  <View style={styles.container}>
    <FontAwesome5
      name="dice-four"
      size={30}
      color="#0C7EF2"
      style={styles.icons}
    />
    <Ionicons name="camera" size={30} color="#0C7EF2" style={styles.icons} />
    <FontAwesome name="photo" size={30} color="#0C7EF2" style={styles.icons} />
    <FontAwesome
      name="microphone"
      size={30}
      color="#0C7EF2"
      style={styles.icons}
    />
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      placeholder="Aa"
      value={value}
    />
    <AntDesign name="like1" size={30} color="#0C7EF2" style={styles.icons} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#0C7EF2",
    borderWidth: 1,
    color: "#fff",
    flex: 1,
    borderRadius: 15,
    paddingLeft: 15,
  },
  icons: {
    marginHorizontal: 5,
  },
});

export default InputBar;
