import React, { useContext, useEffect, useState, useMemo } from "react";
import { ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { Profile } from "@/src/types/Profile";
import { Chat } from "@/src/types/Message";

import SearchBar from "@/src/components/Search/SearchBar";
import NoteBar from "@/src/components/Chats/Notes";
import ChatItem from "@/src/components/Chats/ChatList";
import Loading from "../../Loading/Loading";
import {
  getChats,
  sortChatWithLastMessage,
  subscribeToChats,
} from "@/src/firebase/Services/Message";
import {
  getAllProfiles,
  subscribeToProfiles,
} from "@/src/firebase/Services/Profile";

const HomeScreen: React.FC = () => {
  const { userInfo } = useContext(RegistrationContext);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [otherProfile, setOtherProfile] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Chỉ hiển thị Loading khi userInfo chưa sẵn sàng
  if (loading && !userInfo) {
    return <Loading />;
  }

  // Fetch dữ liệu ban đầu cho danh sách chat và profile
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
        setLoading(false);
      }
    }

    if (userInfo) {
      fetchChatData();
    }
  }, [userInfo]);

  // Theo dõi sự thay đổi của danh sách chat theo thời gian thực
  useEffect(() => {
    if (!userInfo) return;

    const unsubscribeChats = subscribeToChats(userInfo.userId, (chats) => {
      const sortedChats = sortChatWithLastMessage(chats);
      setChatList(sortedChats);
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
  }, [userInfo]);

  // Sử dụng useMemo để tránh tính toán lại danh sách chat và profile khi không cần thiết
  const memoizedChatList = useMemo(() => chatList, [chatList]);
  const memoizedOtherProfiles = useMemo(() => otherProfile, [otherProfile]);

  return (
    <SafeAreaView style={styles.container}>
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
