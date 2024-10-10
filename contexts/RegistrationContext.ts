import { createContext } from "react";
import { User } from "firebase/auth";

export type RegistrationContextType = {
  user: User | null;
  firstName: string | null;
  setFirstName: (firstName: string | null) => void;

  lastName: string | null;
  setLastName: (lastName: string | null) => void;

  email: string | null;
  setEmail: (email: string | null) => void;

  dateOfBirth: string | null;
  setDateOfBirth: (dateOfBirth: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;

  loginFromGoogle: boolean;
  setLoginFromGoogle: (loginFromGoogle: boolean) => void;
};

export const RegistrationContext = createContext<RegistrationContextType>(
  {} as RegistrationContextType
);
