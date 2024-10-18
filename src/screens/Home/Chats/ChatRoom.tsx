import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { FlatList, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Attachment, Chat, Message } from "@/src/types/Message";
import * as MessageService from "../../../firebase/Services/Message";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { getAvatarProfile, getProfile } from "@/src/firebase/Services/Profile";

import ChatHeader from "@/src/components/Header/ChatHeader";
import ChatBubble from "@/src/screens/Home/Chats/ChatBubble";
import ChatInput from "@/src/components/Input/ChatInput";
import { showErrorToast } from "@/src/components/Toast/Toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/src/firebase/firebase";

const ChatScreen: React.FC<any> = (navigation) => {
  const props = navigation.route.params;
  const { userInfo } = useContext(RegistrationContext);
  const [inputText, setInputText] = useState("");
  const [chatName, setChatName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [chat, setChat] = useState<Chat>({ ...props });

  const flatListRef = useRef<FlatList>(null);

  const otherParticipant = useMemo(
    () =>
      chat.participants?.filter(
        (participant) => participant !== userInfo?.userId
      ),
    [chat.participants, userInfo?.userId]
  );

  const getChatName = useCallback(async () => {
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
  }, [chat.chatName, otherParticipant]);

  const getAvatar = useCallback(async () => {
    if (otherParticipant && otherParticipant.length === 1) {
      return await getAvatarProfile(otherParticipant[0]);
    } else if (otherParticipant && otherParticipant.length > 1) {
      return await getAvatarProfile(otherParticipant[0]);
    } else if (chat.avatarUrl) {
      return chat.avatarUrl;
    }
  }, [chat.avatarUrl, otherParticipant]);

  const createChat = useCallback(async (chatData: Chat) => {
    try {
      const chatId = await MessageService.createNewChat(chatData);
      return chatId;
    } catch (error) {
      console.error("Error creating chat", error);
    }
  }, []);

  const updateMessage = useCallback(
    async (message: Message, chat: Chat) => {
      const updatedChat = {
        ...chat,
        messages: chat.messages.map((msg) =>
          msg.messageId === message.messageId ? message : msg
        ),
      };
      setChat(updatedChat);

      try {
        await MessageService.sendMessage(updatedChat.chatId, message);
      } catch (error) {
        console.error("Error sending message", error);
        navigation.navigate("Home");
      }
    },
    [navigation]
  );

  const sendMessage = useCallback(() => {
    if (inputText.trim()) {
      const message: Message = {
        messageId: Date.now().toString(),
        userId: chat.userId,
        senderId: userInfo?.userId || "",
        message: inputText,
        timestamp: new Date().toISOString(),
        isDeleted: false,
        isEdited: false,
        editRecents: [],
        attachments: [],
      };

      const messageUpdate = [...chat.messages, { ...message }];

      const chatUpdated = {
        ...chat,
        messages: messageUpdate,
      };

      updateMessage(message, chatUpdated);
      setInputText("");
    }
  }, [inputText, chat, updateMessage, userInfo?.userId]);

  const handlePhotoPicker = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return showErrorToast(
        "Ứng dụng cần quyền truy cập để cập nhật ảnh đại diện."
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const storageRef = ref(storage, `chats/${chat.chatId}`);
      const snapshot = await uploadBytes(storageRef, await response.blob());

      // get the download url
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    }
  }, [chat.chatId]);

  const sendAttachment = useCallback(async () => {
    const attachmentUrl = await handlePhotoPicker();
    if (attachmentUrl) {
      const attachment: Attachment = {
        attachmentId: Date.now().toString(),
        type: "image",
        url: attachmentUrl,
      };

      const message: Message = {
        ...chat,
        messageId: Date.now().toString(),
        senderId: userInfo?.userId || "",
        message: "",
        timestamp: new Date().toISOString(),
        isDeleted: false,
        isEdited: false,
        attachments: [attachment],
      };

      const messageUpdate = [...chat.messages, { ...message }];
      updateMessage(message, { ...chat, messages: messageUpdate });
    }
  }, [chat, handlePhotoPicker, updateMessage, userInfo?.userId]);

  useEffect(() => {
    if (!chat.chatId) {
      const newChat: Chat = {
        chatId: props.chatId,
        userId: props.userId,
        avatarUrl: props.avatarUrl,
        chatName: "",
        messages: [],
        participants: props.participants,
        isGroupChat: props.isGroupChat,
      };

      createChat(newChat);
      setChat(newChat);
    }

    if (!chat.chatName) {
      getChatName().then((name) => setChatName(name || ""));
    }

    if (!chat.avatarUrl) {
      getAvatar().then((avatar) => setAvatar(avatar || ""));
    }
  }, [
    chat.chatId,
    chat.chatName,
    chat.avatarUrl,
    createChat,
    getAvatar,
    getChatName,
    props,
  ]);

  useEffect(() => {
    const unsubscribe = MessageService.subscribeToChat(
      chat.chatId,
      (newChat) => {
        setChat(newChat);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chat.chatId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ChatHeader chat={chat} chatName={chatName} chatAvatar={avatar} />
      <FlatList
        ref={flatListRef}
        data={chat.messages}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            isUser={item.senderId === userInfo?.userId}
          />
        )}
        keyExtractor={(item) => item.messageId}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        sendMessage={sendMessage}
        sendAttachment={sendAttachment}
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
