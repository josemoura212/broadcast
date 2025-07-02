import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/auth-context";
import {
  addConnection,
  Connection,
  deleteConnection,
  updateConnection,
} from "../connection.model";
import { useSnapshot } from "../../hooks/firestore-hooks";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../infra/services/firebase";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { DefaultMenu } from "../../components/default-menu";
import { InlineEditFields } from "../../components/inline-edit-fields";
import { ActionListItem } from "../../components/action-list-item";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export function ConnectionPage() {
  const { user } = useAuth();
  const [newConnection, setNewConnection] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
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
      return;
    }
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
            required
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
              {connections.map((conn) =>
                editingId === conn.id ? (
                  <ListItem key={conn.id} divider>
                    <InlineEditFields
                      fields={[
                        { label: "Nome", name: "name", value: editingName },
                      ]}
                      onChange={(value) => setEditingName(value)}
                      onSave={handleSaveEdit}
                      onCancel={handleCancelEdit}
                    />
                  </ListItem>
                ) : (
                  <ActionListItem
                    key={conn.id}
                    primary={conn.name}
                    onEdit={() => handleStartEdit(conn.id, conn.name)}
                    onDelete={() => setConfirmDeleteId(conn.id)}
                    divider={true}
                  />
                )
              )}
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
}
