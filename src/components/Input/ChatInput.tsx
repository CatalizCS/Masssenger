import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  sendMessage: () => void;
  sendAttachment: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  sendMessage,
  sendAttachment,
}) => (
  <View style={styles.inputContainer}>
    <Ionicons name="add" size={24} color="gray" onPress={sendAttachment} />
    <TextInput
      style={styles.input}
      value={inputText}
      onChangeText={setInputText}
      placeholder="Aa"
    />
    <TouchableOpacity onPress={sendMessage}>
      <Ionicons name="send" size={24} color="purple" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
});

export default ChatInput;
