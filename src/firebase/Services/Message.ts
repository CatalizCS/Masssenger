import { db } from "@/src/firebase/firebase";
import { Message, Chat } from "@/src/types/Message";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  const chatRef = doc(db, "chats", userId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    return chatDoc.data().chats as Chat[];
  } else {
    throw new Error("Chats not found");
  }
};

export const sortChatWithLastMessage = (chats: Chat[]): Chat[] => {
  return chats.sort((a, b) => {
    const aTime = new Date(a.messages[a.messages.length - 1].timestamp);
    const bTime = new Date(b.messages[b.messages.length - 1].timestamp);

    return bTime.getTime() - aTime.getTime();
  });
};

export const sendMessage = async (chatId: string, message: Message) => {
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    const messages = chatDoc.data().messages as Message[];
    messages.push(message);
    await setDoc(chatRef, { messages }, { merge: true });
  } else {
    throw new Error("Chat not found");
  }
};
