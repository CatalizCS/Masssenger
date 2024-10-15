import { db } from "@/src/firebase/firebase";
import { Message, Chat } from "@/src/types/Message";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const getMessages = async (chatId: string): Promise<Message[]> => {
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    return chatDoc.data().messages as Message[];
  } else {
    throw new Error("Chat not found");
  }
};

export const getChat = async (chatId: string): Promise<Chat> => {
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    return chatDoc.data() as Chat;
  } else {
    throw new Error("Chat not found");
  }
};

export const getChats = async (userId: string): Promise<Chat[]> => {
  const chats: Chat[] = [];

  const querySnapshot = await getDocs(collection(db, "chats"));
  querySnapshot.forEach((doc) => {
    const chat = doc.data() as Chat;

    if (chat.participants.includes(userId)) {
      chats.push(chat);
    }
  });

  return chats;
};

export const updateChat = async (chat: Chat) => {
  const chatRef = doc(db, "chats", chat.chatId);
  await setDoc(chatRef, chat, { merge: true });
};

export const sortChatWithLastMessage = (chats: Chat[]): Chat[] => {
  return chats.sort((a, b) => {
    const aTime = new Date(a.messages[a.messages.length - 1].timestamp);
    const bTime = new Date(b.messages[b.messages.length - 1].timestamp);

    return bTime.getTime() - aTime.getTime();
  });
};

export const sendMessage = async (
  chatId: string,
  message: Message,
  chatData: Chat
) => {
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    const messages = chatDoc.data().messages as Message[];
    messages.push(message);
    await setDoc(chatRef, { messages }, { merge: true });
  } else {
    const chat: Chat = {
      chatId: chatId || "",
      userId: message.userId || "unknownUserId",
      avatarUrl: chatData?.avatarUrl || "defaultAvatarUrl",
      chatName: chatData.chatName || "Unnamed Chat",
      messages: [message],
      readStatus: [{ userId: message.userId || "", read: false }],
      participants: [message.userId || "", message.senderId || ""],
      isGroupChat: false,
    };
    await setDoc(chatRef, chat);
  }
};

import { onSnapshot as firestoreOnSnapshot } from "firebase/firestore";

export const subscribeToChat = (
  chatId: string,
  chatData: Chat,
  onSnapshot: (chat: Chat) => void
) => {
  const chatRef = doc(db, "chats", chatId);
  return firestoreOnSnapshot(chatRef, (snapshot) => {
    if (snapshot.exists()) {
      onSnapshot(snapshot.data() as Chat);
    } else {
      console.log("Chat not found, creating new chat", chatId);

      const chat: Chat = {
        chatId,
        userId: chatData.userId,
        avatarUrl: chatData.avatarUrl,
        chatName: chatData.chatName,
        messages: [],
        readStatus: [{ userId: chatData.userId, read: false }],
        participants: [chatData.userId, chatData.userId],
        isGroupChat: false,
      };

      console.log("Creating new chat", chat);

      setDoc(chatRef, chat);
    }
  });
};
