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

    if (chat.participants.includes(userId) && !chat.isDeleted) {
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
    if (a.messages.length === 0) {
      return 1;
    }

    if (b.messages.length === 0) {
      return -1;
    }

    const aTime = new Date(a.messages[a.messages.length - 1].timestamp);
    const bTime = new Date(b.messages[b.messages.length - 1].timestamp);

    return bTime.getTime() - aTime.getTime();
  });
};

export const createNewChat = async (chat: Chat) => {
  try {
    const newDocRef = doc(collection(db, "chats"));
    chat.chatId = newDocRef.id;
    await setDoc(newDocRef, chat);
    return chat.chatId;
  } catch (error) {
    console.error("Error creating chat", error);
  }
};

export const sendMessage = async (chatId: string, message: Message) => {
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    const messages = (chatDoc.data().messages as Message[]) ?? [];
    messages.push(message);
    await setDoc(chatRef, { messages }, { merge: true });
  }
};

import { onSnapshot as firestoreOnSnapshot } from "firebase/firestore";

export const subscribeToChat = (
  chatId: string,
  onSnapshot: (chat: Chat) => void
) => {
  const chatRef = doc(db, "chats", chatId);
  return firestoreOnSnapshot(chatRef, (snapshot) => {
    if (snapshot.exists()) {
      const chat = snapshot.data() as Chat;
      onSnapshot(chat);
    }
  });
};

export const subscribeToChats = (
  userId: string,
  onSnapshot: (chats: Chat[]) => void
) => {
  const chatRef = collection(db, "chats");
  return firestoreOnSnapshot(chatRef, (snapshot) => {
    const chats: Chat[] = [];
    snapshot.forEach((doc) => {
      const chat = doc.data() as Chat;

      if (chat.participants.includes(userId) && !chat.isDeleted) {
        chats.push(chat);
      }
    });

    onSnapshot(chats);
  });
};

export const deleteChat = async (chatId: string) => {
  const chatRef = doc(db, "chats", chatId);
  await setDoc(chatRef, { isDeleted: true }, { merge: true });
};
