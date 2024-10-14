import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { Chat } from "@/src/types/Message";
import ChatListItem from "./ChatListItems";

interface ChatListItemProps {
  chats: Chat[];
}

const Chats: React.FC<ChatListItemProps> = ({ chats }) => {
  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.chatId}
      renderItem={({ item }) => <ChatListItem chat={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Chats;
