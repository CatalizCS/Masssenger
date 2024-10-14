import { createContext } from "react";
import { Profile } from "@/src/types/Profile";
import { User } from "firebase/auth";
import { Contact } from "../components/Drawer/NewMessageDrawer";

export type ChatsContext = {
  Suggestions: Contact[];
  setSuggestions: (suggestions: Contact[]) => void;
};

export const ChatsContext = createContext<ChatsContext>(
  {} as ChatsContext
);
