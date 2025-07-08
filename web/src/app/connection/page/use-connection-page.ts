import { useAuth } from "@/app/context/auth-context";
import {
  Connection,
  deleteConnection,
  useConnection,
} from "../connection.model";
import { useState } from "react";

export interface ConnectionController {
  confirmDeleteId: string | null;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  connections: Connection[];
  loading: boolean;
  handleRemoveConnection: (connectionId: string) => Promise<void>;
}

export function useConnectionPage() {
  const { user } = useAuth();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { state: connections, loading } = useConnection(user?.uid || "");

  async function handleRemoveConnection(connectionId: string) {
    if (!user) return;
    await deleteConnection(connectionId);
    setConfirmDeleteId(null);
  }

  const controller: ConnectionController = {
    confirmDeleteId,
    setConfirmDeleteId,
    connections,
    loading,
    handleRemoveConnection,
  };

  return controller;
}
