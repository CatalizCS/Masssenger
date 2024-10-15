import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "@/src/types/Message";

interface ChatBubbleProps {
  message: Message;
  isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => (
  <View
    style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}
  >
    <Text style={styles.messageText}>{message.message}</Text>
    {message.isEdited && <Text style={styles.editedText}>(edited)</Text>}
    {message.attachments && message.attachments.length > 0 && (
      <Text style={styles.attachmentText}>
        Attachment: {message.attachments[0].type}
      </Text>
    )}
    <Text style={styles.timestampText}>
      {new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    color: "#fff",
  },
  editedText: {
    fontSize: 10,
    color: "#ddd",
    marginTop: 2,
  },
  attachmentText: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 4,
  },
  timestampText: {
    fontSize: 10,
    color: "#ddd",
    alignSelf: "flex-end",
    marginTop: 2,
  },
});

export default ChatBubble;
