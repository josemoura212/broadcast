import { createContext, useContext, useEffect, useState } from "react";
import { Connection } from "../connection/connection.model";

interface ConnectionContextType {
  conn: Connection | null;
  setConn: (conn: Connection | null) => void;
}

const ConnectionContext = createContext<ConnectionContextType>({
  conn: null,
  setConn: () => {},
});

export const useConnection = () => useContext(ConnectionContext);

const CONN_KEY = "selectedConnection";

export function ConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conn, setConn] = useState<Connection | null>(
    JSON.parse(localStorage.getItem(CONN_KEY) || "null")
  );

  useEffect(() => {
    localStorage.setItem(CONN_KEY, JSON.stringify(conn));
  }, [conn]);

  return (
    <ConnectionContext.Provider value={{ conn, setConn }}>
      {children}
    </ConnectionContext.Provider>
  );
}
