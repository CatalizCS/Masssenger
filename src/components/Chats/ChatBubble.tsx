import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Message } from "@/src/types/Message";

interface ChatBubbleProps {
  message: Message;
  isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
  return (
    <View
      style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}
    >
      <Text style={[styles.messageText, !isUser && styles.otherMessageText]}>
        {message.message}
      </Text>
      {message.isEdited && <Text style={styles.editedText}>(edited)</Text>}
      {message.attachments && message.attachments.length > 0 && (
        <>
          <Text
            style={!isUser ? styles.otherAttachmentText : styles.attachmentText}
          >
            Attachment
          </Text>
          {message.attachments?.map((attachment, index) => (
            <Image
              key={index}
              source={{ uri: attachment.url }}
              style={styles.attachmentImage}
            />
          ))}
        </>
      )}
      {message.timestamp && (
        <Text
          style={!isUser ? styles.otherTimestampText : styles.timestampText}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) ?? ""}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  username: {
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: "#e5e5ea",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
  },
  otherBubble: {
    alignSelf: "flex-start",
    paddingLeft: 10,
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    color: "#fff",
  },

  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 5,
  },

  otherMessageText: {
    color: "#000",
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

  otherAttachmentText: {
    fontSize: 12,
    color: "#000",
    marginTop: 4,
  },

  timestampText: {
    fontSize: 10,
    color: "#ddd",
    alignSelf: "flex-end",
    marginTop: 2,
  },
  otherTimestampText: {
    fontSize: 10,
    color: "#000",
    alignSelf: "flex-end",
    marginTop: 2,
  },
});

export default ChatBubble;
