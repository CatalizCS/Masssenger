import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

const MessageItem: React.FC<any> = ({
  message,
  isMe,
  img,
  imageUri,
  width,
}) => {
  const bgColor = isMe ? "#D2476F" : "#4f4f4f";
  const alignment = isMe ? "flex-end" : "flex-start";
  const flexDirection = isMe ? "column" : "row";
  const borderRadius = isMe
    ? { borderTopLeftRadius: 20 }
    : { borderBottomRightRadius: 20 };

  return (
    <View
      style={[
        styles.container,
        { width, alignItems: alignment, flexDirection },
      ]}
    >
      {!isMe && (
        <Image source={{ uri: imageUri }} style={styles.profileImage} />
      )}
      <View
        style={[
          styles.messageBox,
          { backgroundColor: bgColor, ...borderRadius },
        ]}
      >
        {img && (
          <Image
            source={{ uri: img }}
            style={{ width: width * 0.65, height: 150 }}
          />
        )}
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageBox: {
    maxWidth: "70%",
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    padding: 10,
  },
});

export default MessageItem;
