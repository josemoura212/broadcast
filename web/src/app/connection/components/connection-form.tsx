import { useAuth } from "@/app/context/auth-context";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import {
  addConnection,
  Connection,
  updateConnection,
} from "../connection.model";

interface ConnectionFormProps {
  connection?: Connection | null;
  editingMode: boolean;
  setEditingMode: (editing: boolean) => void;
}

export function ConnectionForm(props: ConnectionFormProps) {
  const { editingMode, setEditingMode, connection } = props;

  const { user } = useAuth();
  const [newConnection, setNewConnection] = useState("");

  useEffect(() => {
    if (editingMode && connection) {
      setNewConnection(connection.name);
    }
    if (!editingMode) {
      setNewConnection("");
    }
  }, [editingMode, connection]);

  async function handleAddConnection(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newConnection.trim()) {
      return;
    }

    if (editingMode) {
      if (!connection) return;
      await updateConnection(connection.id, newConnection.trim());
      setEditingMode(false);
      setNewConnection("");
      return;
    }

    await addConnection(user.uid, newConnection.trim());
    setNewConnection("");
  }

  return (
    <form
      onSubmit={handleAddConnection}
      className="flex gap-3 mb-3 items-start"
    >
      <TextField
        label="Nome da conexão"
        value={newConnection}
        onChange={(e) => setNewConnection(e.target.value)}
        size="small"
        fullWidth
        required
        autoFocus
      />
      <Button type="submit" variant="contained" color="primary">
        {editingMode ? "Salvar" : "Adicionar"}
      </Button>
      {editingMode && (
        <Button
          variant="contained"
          color="error"
          onClick={() => setEditingMode(false)}
        >
          Cancelar
        </Button>
      )}
    </form>
  );
}
