import { Chat } from "@/src/types/Message";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const ChatItem: React.FC<{ chat: Chat; currentUserId: string }> = ({
  chat,
  currentUserId,
}) => {
  const navigation = useNavigation();
  const lastMessage = chat.messages[chat.messages.length - 1];
  const isUnread =
    chat.readStatus.find((status) => status.userId === currentUserId)?.read ===
    false;

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        const chatId = chat.chatId;
        const userId = chat.userId;
        const avatarUrl = chat.avatarUrl;
        const chatName = chat.chatName;
        const messages = chat.messages ?? [];
        const readStatus = chat.readStatus ?? [];
        const participants = chat.participants ?? [];
        const isGroupChat = chat.isGroupChat ?? false;

        //@ts-ignore
        navigation.navigate("ChatRoom", {
          chatId,
          userId,
          avatarUrl,
          chatName,
          messages,
          readStatus,
          participants,
          isGroupChat,
        });
      }}
    >
      <Image
        source={{ uri: chat.avatarUrl || "https://via.placeholder.com/50" }}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{chat.chatName}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage ? lastMessage.message : "No messages yet"}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {lastMessage
            ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>
        {isUnread && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  lastMessage: {
    color: "gray",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  time: {
    color: "gray",
    fontSize: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "blue",
    marginTop: 5,
  },
});

export default ChatItem;
