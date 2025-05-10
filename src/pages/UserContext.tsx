import React, { createContext, useContext, useState, useEffect } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

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

  const [deviceID, setDeviceID] = useState<string | null>(null);

  useEffect(() => {
    // Get device ID either from localStorage or FingerprintJS
    const storedDeviceID = localStorage.getItem("deviceIDFingerPrint");
    if (storedDeviceID) {
      setDeviceID(storedDeviceID);
    } else {
      (async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const deviceID = result.visitorId;
        setDeviceID(deviceID);
        localStorage.setItem("deviceIDFingerPrint", deviceID); // Store the deviceID in localStorage
      })();
    }
  }, []);

  useEffect(() => {
    if (userID) {
      localStorage.setItem("identifier", userID);
    } else {
      localStorage.removeItem("identifier");
    }
  }, [userID]);

  if (!deviceID) return null; // Optional: Display loading or fallback content until deviceID is ready

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
