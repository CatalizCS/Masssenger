import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatHeader from "@/src/components/Header/ChatHeader";
import ChatBubble from "@/src/components/Chats/ChatBubble";
import ChatInput from "@/src/components/Input/ChatInput";
import { Chat, Message } from "@/src/types/Message";
import * as MessageService from "../../../firebase/Services/Message";

const ChatScreen: React.FC<any> = (navigation) => {
  const props = navigation.route.params;
  const [chat, setChat] = useState<Chat>({
    ...props,
  });

  const [inputText, setInputText] = useState("");

  async function updateMessage(message: Message, chat: Chat) {
    const updatedChat = {
      ...chat,
      messages: chat.messages.map((msg) => {
        if (msg.messageId === message.messageId) {
          return message;
        }
        return msg;
      }),
    };
    setChat(updatedChat);

    try {
      await MessageService.sendMessage(updatedChat.chatId, message, chat);
    } catch (error) {
      console.error("Error sending message", error);
      navigation.navigate("Home");
    }
  }

  const sendMessage = () => {
    try {
      if (inputText.trim()) {
        const message: Message = {
          messageId: Date.now().toString(),
          userId: chat.userId,
          senderId: chat.userId,
          message: inputText,
          timestamp: new Date().toISOString(),
          isDeleted: false,
          isEdited: false,
          editRecents: [],
          attachments: [],
        };

        const messageUpdate = [...chat.messages, { ...message }];

        const chatUpdated = {
          chatId: props.chatId,
          userId: props.userId,
          avatarUrl: props.avatarUrl,
          chatName: props.chatName,
          messages: messageUpdate,
          readStatus: [{ userId: props.userId, read: false }] as [
            { userId: string; read: boolean }
          ],
          participants: props.participants,
          isGroupChat: props.isGroupChat,
        };
        updateMessage(message, chatUpdated);

        setChat({
          ...chat,
          messages: messageUpdate,
        });

        setInputText("");
      }
    } catch (error) {
      console.error("Error sending message", error);
      navigation.navigate("Home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ChatHeader chat={chat} />
      <FlatList
        ref={(ref) => {
          if (ref) {
            ref.scrollToEnd({ animated: true });
          }
        }}
        data={chat.messages}
        renderItem={({ item }) => (
          <ChatBubble message={item} isUser={item.senderId === chat.userId} />
        )}
        keyExtractor={(item) => item.messageId}
        contentContainerStyle={styles.chatContainer}
      />
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        sendMessage={sendMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatContainer: {
    padding: 10,
  },
});

export default ChatScreen;
