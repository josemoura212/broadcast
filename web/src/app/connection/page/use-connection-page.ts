import { useAuth } from "@/app/context/auth-context";
import { Connection, deleteConnection } from "../connection.model";
import { useMemo, useState } from "react";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/infra/services/firebase";
import { useSnapshot } from "@/app/hooks/firestore-hooks";

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

  const ref = useMemo(
    () =>
      query(
        collection(db, `connections`) as CollectionReference<Connection>,
        orderBy("name"),
        where("userId", "==", user?.uid)
      ),
    [user?.uid]
  );
  const { state: connections, loading } = useSnapshot<Connection>(ref);

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
