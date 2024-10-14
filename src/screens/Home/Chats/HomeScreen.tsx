import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  getChats,
  sortChatWithLastMessage,
} from "@/src/firebase/Services/Message";
import { Chat } from "@/src/types/Message";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import ChatList from "@/src/components/Chats/ChatList";

const HomeScreen: React.FC<any> = () => {
  const { userInfo } = useContext(RegistrationContext);
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChatData() {
      try {
        if (!userInfo) {
          setLoading(false);
          return;
        }

        const chats = await getChats(userInfo.userId);
        const sortedChats = sortChatWithLastMessage(chats);

        setChatData(sortedChats);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchChatData();
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {chatData.length != 0 ? (
        <ChatList chats={chatData} />
      ) : (
        <View>
          <Text style={styles.text}>Không có cuộc trò chuyện nào</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeScreen;
