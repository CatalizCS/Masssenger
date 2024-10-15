import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Chat } from "@/src/types/Message";
import { useNavigation } from "@react-navigation/native";

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Ionicons
        name="chevron-back"
        size={30}
        color="purple"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.headerContent}>
        <Image source={{ uri: chat.avatarUrl }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{chat.chatName}</Text>
          <Text style={styles.status}>
            {chat.isGroupChat
              ? `${chat.participants.length} participants`
              : "Active 6h ago"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Ionicons
          name="call"
          size={30}
          style={{ paddingRight: 20 }}
          color="purple"
        />
        <Ionicons name="videocam" size={30} color="purple" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    fontSize: 12,
    color: "gray",
  },
});

export default ChatHeader;
