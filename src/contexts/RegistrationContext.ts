import { createContext } from "react";
import { Profile } from "@/src/types/Profile";
import { User } from "firebase/auth";

export type RegistrationContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  userInfo: Profile | null;
  setUserInfo: (profile: Profile | null) => void;
};

export const RegistrationContext = createContext<RegistrationContextType>(
  {} as RegistrationContextType
);
