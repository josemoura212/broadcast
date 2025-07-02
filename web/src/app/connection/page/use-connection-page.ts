import { useAuth } from "@/app/context/auth-context";
import {
  addConnection,
  Connection,
  deleteConnection,
  updateConnection,
} from "../connection.model";
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
  newConnection: string;
  setNewConnection: React.Dispatch<React.SetStateAction<string>>;
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  editingName: string;
  setEditingName: React.Dispatch<React.SetStateAction<string>>;
  confirmDeleteId: string | null;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  connections: Connection[];
  loading: boolean;
  handleAddConnection: (e: React.FormEvent) => Promise<void>;
  handleRemoveConnection: (connectionId: string) => Promise<void>;
  handleStartEdit: (id: string, name: string) => void;
  handleSaveEdit: () => Promise<void>;
  handleCancelEdit: () => void;
}

export function useConnectionPage() {
  const { user } = useAuth();
  const [newConnection, setNewConnection] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
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

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newConnection.trim()) {
      return;
    }
    await addConnection(user.uid, newConnection.trim());
    setNewConnection("");
  };

  const handleRemoveConnection = async (connectionId: string) => {
    if (!user) return;
    await deleteConnection(connectionId);
    setConfirmDeleteId(null);
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = async () => {
    if (!user || !editingId || !editingName.trim()) return;
    await updateConnection(editingId, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const controller: ConnectionController = {
    newConnection,
    setNewConnection,
    editingId,
    setEditingId,
    editingName,
    setEditingName,
    confirmDeleteId,
    setConfirmDeleteId,
    connections,
    loading,
    handleAddConnection,
    handleRemoveConnection,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
  };

  return {
    controller,
  };
}
