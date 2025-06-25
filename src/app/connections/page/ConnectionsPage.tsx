import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import {
  addConnection,
  Connection,
  deleteConnection,
  updateConnection,
} from "../domain/models/ConnectionModel";
import { useSnapshot } from "../../hooks/global-hooks";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../infra/services/firebase";
import ConfirmDialog from "../../components/ConfirmDialog";
import DefaultMenu from "../../components/DefaultMenu";

const ConnectionPage: React.FC = () => {
  const { user } = useAuth();
  const [newConnection, setNewConnection] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newConnectionError, setNewConnectionError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const ref = useMemo(
    () =>
      query(
        collection(
          db,
          `clients/${user?.uid}/connections`
        ) as CollectionReference<Connection>,
        orderBy("name")
      ),
    [user?.uid]
  );
  const { state: connections, loading } = useSnapshot<Connection>(ref);

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newConnection.trim()) {
      setNewConnectionError("O nome da conexão é obrigatório.");
      return;
    }

    setNewConnectionError("");
    await addConnection(user.uid, newConnection.trim());
    setNewConnection("");
  };

  const handleRemoveConnection = async (connectionId: string) => {
    if (!user) return;
    await deleteConnection(user.uid, connectionId);
    setConfirmDeleteId(null);
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = async () => {
    if (!user || !editingId || !editingName.trim()) return;
    await updateConnection(user.uid, editingId, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Minhas Conexões
        </Typography>
        <form
          onSubmit={handleAddConnection}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            alignItems: "flex-start",
          }}
        >
          <TextField
            label="Nome da conexão"
            value={newConnection}
            onChange={(e) => setNewConnection(e.target.value)}
            size="small"
            fullWidth
            error={!!newConnectionError}
            helperText={newConnectionError}
          />
          <Button type="submit" variant="contained" color="primary">
            Adicionar
          </Button>
        </form>
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {connections.map((conn) => (
                <ListItem key={conn.id} divider sx={{ mb: 1, py: 2 }}>
                  {editingId === conn.id ? (
                    <>
                      <TextField
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        size="small"
                        sx={{ mr: 1, flex: 1 }}
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={handleSaveEdit}
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <ListItemText primary={conn.name} />
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleStartEdit(conn.id, conn.name)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setConfirmDeleteId(conn.id)}
                      >
                        Remover
                      </Button>
                    </>
                  )}
                </ListItem>
              ))}
              {connections.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma conexão cadastrada.
                </Typography>
              )}
            </List>
          </Box>
        )}
      </DefaultMenu>
      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Confirmar remoção"
        message="Tem certeza que deseja remover esta conexão? Essa ação não pode ser desfeita."
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => handleRemoveConnection(confirmDeleteId!)}
        confirmText="Remover"
        confirmColor="error"
      />
    </>
  );
};

export default ConnectionPage;
