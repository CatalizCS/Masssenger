import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { getChats, subscribeToChats } from "@/src/firebase/Services/Message";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { Profile } from "@/src/types/Profile";
import { Chat } from "@/src/types/Message";
import {
  getAllProfiles,
  subscribeToProfiles,
} from "@/src/firebase/Services/Profile";

import SearchBar from "@/src/components/Search/SearchBar";
import NoteBar from "@/src/screens/Home/Chats/Notes";
import ChatItem from "@/src/screens/Home/Chats/ChatList";
import Loading from "../../Loading/Loading";
import NotificationToast from "@/src/components/Toast/NotificationToast";

const HomeScreen: React.FC = () => {
  const { userInfo } = useContext(RegistrationContext);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [otherProfile, setOtherProfile] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  if (loading && !userInfo) {
    return <Loading />;
  }

  const showToast = useCallback((title: string, message: string) => {
    setToastTitle(title);
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    async function fetchChatData() {
      try {
        if (!userInfo) return;

        const chats = await getChats(userInfo.userId);
        const sortedChats = sortChatWithLastMessage(chats);

        const profiles = await getAllProfiles();
        setOtherProfile(
          profiles.filter((profile) => profile.userId !== userInfo.userId)
        );

        if (sortedChats.length === 0) {
          setLoading(false);
          return;
        }

        setChatList(sortedChats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setLoading(false);
      }
    }

    if (userInfo) {
      fetchChatData();
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) return;

    const unsubscribeChats = subscribeToChats(userInfo.userId, (chats) => {
      const sortedChats = sortChatWithLastMessage(chats);
      setChatList((prevChatList) => {
        sortedChats.forEach((newChat) => {
          const existingChat = prevChatList.find(
            (chat) => chat.chatId === newChat.chatId
          );
          if (!existingChat) return;

          const lastMessage = newChat.messages[newChat.messages.length - 1];
          const previousLastMessage =
            existingChat.messages[existingChat.messages.length - 1];

          if (
            lastMessage &&
            previousLastMessage &&
            lastMessage.timestamp !== previousLastMessage.timestamp &&
            lastMessage.senderId !== userInfo.userId
          ) {
            const sender = otherProfile.find(
              (profile) => profile.userId === lastMessage.senderId
            );

            showToast(
              "Tin nhắn mới",
              `Bạn có tin nhắn mới trong ${
                newChat.isGroupChat ? newChat.chatName : "cuộc trò chuyện"
              }`
            );
          }
        });
        return sortedChats;
      });
    });

    const unsubscribeProfiles = subscribeToProfiles((profiles) => {
      setOtherProfile(
        profiles.filter((profile) => profile.userId !== userInfo.userId)
      );
    });

    return () => {
      unsubscribeChats();
      unsubscribeProfiles();
    };
  }, [userInfo, showToast]);

  const memoizedChatList = useMemo(() => chatList, [chatList]);
  const memoizedOtherProfiles = useMemo(() => otherProfile, [otherProfile]);

  return (
    <SafeAreaView style={styles.container}>
      <NotificationToast
        visible={toastVisible}
        title={toastTitle}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />

      <SearchBar />
      <ScrollView>
        {userInfo && (
          <NoteBar
            currentUser={userInfo}
            otherProfile={memoizedOtherProfiles}
          />
        )}
        {memoizedChatList.map((chat) => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            currentUserId={userInfo?.userId || ""}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const sortChatWithLastMessage = (chats: Chat[]): Chat[] => {
  return chats.sort((a, b) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    return (
      new Date(lastMessageB?.timestamp || 0).getTime() -
      new Date(lastMessageA?.timestamp || 0).getTime()
    );
  });
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
