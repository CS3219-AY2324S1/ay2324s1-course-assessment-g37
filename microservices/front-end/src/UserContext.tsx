// should be able to carry both attribute & function
import React, { useState, useContext, ReactNode } from "react";
import { User } from "./components/types";

interface UserContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = React.createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

// Since App is wrapped inside UserProvider, it will get the value initialised by UserProvider
export function UserProvider({ children }: UserProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  const value: UserContextType = {
    currentUser,
    setCurrentUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAppContext not available");
  }
  return context;
}
