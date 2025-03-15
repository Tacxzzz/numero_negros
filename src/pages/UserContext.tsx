import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  userID: string | null;
  setUserID: (id: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userID, setUserID] = useState<string | null>(() => {
    return localStorage.getItem("identifier");
  });

  useEffect(() => {
    if (userID) {
      localStorage.setItem("identifier", userID);
    } else {
      localStorage.removeItem("identifier");
    }
  }, [userID]);

  return <UserContext.Provider value={{ userID, setUserID }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
