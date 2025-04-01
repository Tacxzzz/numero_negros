import { createContext, useState, useContext, ReactNode } from "react";

interface ClientContextType {
  clientId: string | null;
  setClientId: (clientId: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
    const [clientId, setClientId] = useState<string | null>(localStorage.getItem("clientId") || null);

    const handleSetClientId = (newClientId: string) => {
      localStorage.setItem("clientId", newClientId);
      setClientId(newClientId);
    };

  return (
    <ClientContext.Provider value={{ clientId, setClientId: handleSetClientId }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
