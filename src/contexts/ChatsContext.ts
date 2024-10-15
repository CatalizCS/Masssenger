import { createContext } from "react";
import { Chat } from "../types/Message";

export type ChatsContext = {
  Suggestions: Chat[];
  setSuggestions: (suggestions: Chat[]) => void;
  chatList: Chat[];
  setChatList: (chatList: Chat[]) => void;
};

export const ChatsContext = createContext<ChatsContext>({} as ChatsContext);
