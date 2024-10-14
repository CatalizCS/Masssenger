import Layout from "@/src/contexts/Layout";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { getAvatarProfile, getProfile } from "@/src/firebase/Services/Profile";
import Loading from "@/src/screens/Loading/Loading";
import { Chat } from "@/src/types/Message";
import { EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface ChatListItemProps {
  chat: Chat;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat }) => {
  const navigation = useNavigation();
  const { userInfo } = useContext(RegistrationContext);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [chatName, setChatName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    async function fetchAvatar() {
      const avatar = await getAvatarProfile(chat.userId);
      setAvatarUrl(avatar);
    }

    async function fetchChatName() {
      if (chat.chatName) {
        setChatName(chat.chatName);
      } else if (chat.participants.length > 2) {
        let name = "";
        chat.participants.forEach(async (participant) => {
          const profile = await getProfile(participant);
          name += `${profile?.firstName} ${profile?.lastName}, `;
        });

        setChatName(name);
      } else {
        const profile = await getProfile(chat.userId);
        setChatName(`${profile?.firstName} ${profile?.lastName}`);
      }
    }

    fetchAvatar();
    fetchChatName();
    setIsLoading(false);
  });

  if (isLoading) {
    <Loading />;
  }

  const onClick = () => {
    //@ts-ignore
    navigation.navigate("ChatRoom", { chat });
  };

  const renderChatReadStatus = () => {
    if (chat.readStatus.find((status) => status.userId === chat.userId)) {
      return (
        <Image
          source={{ uri: avatarUrl }}
          resizeMode="cover"
          style={styles.messageReadImage}
        />
      );
    } else {
      return <EvilIcons name="check" size={30} color="gray" />;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: avatarUrl }}
              resizeMode="cover"
              style={styles.image}
            />
          </View>
          <View />
          <View style={styles.chatContainer}>
            <Text style={styles.profileName}>{`${chatName}`}</Text>
            <Text style={styles.message}>
              {chat.messages[-1].senderId === userInfo?.userId ? "You: " : ""}
              {chat.messages[-1].timestamp}
            </Text>
          </View>
          <View style={{ width: "5%" }}>
            <View style={styles.chatBubble}>
              {chat.readStatus.length > 0 && renderChatReadStatus()}
            </View>
          </View>
        </View>
        <View style={styles.separator}></View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  imageContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  chatContainer: {
    width: "75%",
  },
  profileName: {
    fontSize: 18,
    color: "white",
  },
  message: {
    fontSize: 16,
    color: "#d9d9d9",
    paddingRight: 10,
  },
  messageReadImage: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  chatBubble: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  separator: {
    width: Layout.window.width * 0.8,
    height: 1,
    marginVertical: 3,
    backgroundColor: "#000",
    marginLeft: Layout.window.width * 0.15,
  },
});

export default ChatListItem;
