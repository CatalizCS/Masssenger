import { getProfile } from "@/src/firebase/Services/Profile";
import { Chat } from "@/src/types/Message";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getAvatarProfile } from "../../../firebase/Services/Profile";
import { deleteChat } from "@/src/firebase/Services/Message";

const ChatItem: React.FC<{ chat: Chat; currentUserId: string }> = ({
  chat,
  currentUserId,
}) => {
  const navigation = useNavigation();
  const lastMessage = chat.messages[chat.messages.length - 1];
  const otherParticipant = chat.participants.filter(
    (participant) => participant !== currentUserId
  );
  const [chatName, setChatName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    async function fetchChatName() {
      const name = await getChatName();
      setChatName(name || "Unknown");
    }

    async function fetchAvatar() {
      const avatarResponse = await getAvatar();
      setAvatar(avatarResponse || "https://via.placeholder.com/50");
    }

    fetchChatName();
    fetchAvatar();
  }, []);

  async function getChatName() {
    if (otherParticipant && otherParticipant.length === 1) {
      const profile = await getProfile(otherParticipant[0]);
      return `${profile?.firstName} ${profile?.lastName}`;
    } else if (otherParticipant && otherParticipant.length > 1) {
      const profileNames = await Promise.all(
        otherParticipant.map(async (participant: string) => {
          const profile = await getProfile(participant);
          return `${profile?.firstName} ${profile?.lastName}`;
        })
      );
      return profileNames.join(", ");
    } else if (chat.chatName) {
      return chat.chatName;
    }
  }

  async function getAvatar() {
    if (otherParticipant && otherParticipant.length === 1) {
      const profile = await getAvatarProfile(otherParticipant[0]);
      return profile;
    } else if (otherParticipant && otherParticipant.length > 1) {
      const profile = await getAvatarProfile(otherParticipant[0]);
      return profile;
    } else if (chat.avatarUrl) {
      return chat.avatarUrl;
    }
  }

  async function onHoldPress() {
    // show menu to delete chat
    if (!chat.isGroupChat) {
      Alert.alert("Delete chat", "Are you sure you want to delete this chat?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteChat(chat.chatId);
            } catch (error) {
              console.error("Error deleting chat", error);
            }
          },
        },
      ]);
    }
  }

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        const chatId = chat.chatId;
        const userId = chat.userId;
        const messages = chat.messages ?? [];
        const participants = chat.participants ?? [];
        const isGroupChat = chat.isGroupChat ?? false;

        //@ts-ignore
        navigation.navigate("ChatRoom", {
          chatId,
          userId,
          messages,
          participants,
          isGroupChat,
        });
      }}
      onLongPress={onHoldPress}
    >
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{chatName}</Text>
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
});

export default ChatItem;
