import { ConfirmDialog } from "@/app/components/confirm-dialog";
import { DefaultMenu } from "@/app/components/default-menu";
import { ActionListItem } from "@/app/components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { deleteConnection, useConnections } from "../connection.model";
import { useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { openAddEditConnectionDialog } from "./connection.facade";
import Button from "@mui/material/Button";

export function ConnectionPage() {
  const { user } = useAuth();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [connections, loading] = useConnections(user?.uid || "");

  async function handleRemoveConnection(connectionId: string) {
    if (!user) return;
    await deleteConnection(connectionId);
    setConfirmDeleteId(null);
  }

  return (
    <>
      <DefaultMenu>
        <Typography variant="h4" mb={2} textAlign={"center"}>
          Minhas Conexões
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => openAddEditConnectionDialog()}
          >
            Criar Conexão
          </Button>
        </Box>
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {connections.map((conn) => (
                <ActionListItem
                  key={conn.id}
                  primary={conn.name}
                  onEdit={() => openAddEditConnectionDialog(conn)}
                  onDelete={() => setConfirmDeleteId(conn.id)}
                  divider={true}
                />
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
}
