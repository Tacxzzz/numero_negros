import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface UserContextType {
  userID: string | null;
  setUserID: (id: string | null) => void;
  deviceID: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userID, setUserID] = useState<string | null>(() => {
    return localStorage.getItem("identifier");
  });

  const [deviceID, setDeviceID] = useState<string | null>(() => {
    let storedID = localStorage.getItem("deviceID");
    if (!storedID) {
      storedID = uuidv4();
      localStorage.setItem("deviceID", storedID);
    }
    return storedID;
  });

  useEffect(() => {
    if (userID) {
      localStorage.setItem("identifier", userID);
    } else {
      localStorage.removeItem("identifier");
    }
  }, [userID]);

  return (
    <UserContext.Provider value={{ userID, setUserID, deviceID }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
