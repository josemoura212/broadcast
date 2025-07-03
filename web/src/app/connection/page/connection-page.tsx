import { ConfirmDialog } from "../../components/confirm-dialog";
import { DefaultMenu } from "../../components/default-menu";
import { ActionListItem } from "../../components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useConnectionPage } from "./use-connection-page";
import { ConnectionForm } from "../components/connection-form";
import { Connection } from "../connection.model";
import { useState } from "react";

export function ConnectionPage() {
  const controller = useConnectionPage();

  const [editingMode, setEditingMode] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(
    null
  );

  function onEditConnection(conn: Connection) {
    setEditingMode(true);
    setEditingConnection(conn);
  }

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Minhas Conexões
        </Typography>
        <ConnectionForm
          connection={editingConnection}
          editingMode={editingMode}
          setEditingMode={setEditingMode}
        />
        {controller.loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {editingMode ? (
                <></>
              ) : (
                controller.connections.map((conn) => (
                  <ActionListItem
                    key={conn.id}
                    primary={conn.name}
                    onEdit={() => onEditConnection(conn)}
                    onDelete={() => controller.setConfirmDeleteId(conn.id)}
                    divider={true}
                  />
                ))
              )}
              {controller.connections.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma conexão cadastrada.
                </Typography>
              )}
            </List>
          </Box>
        )}
      </DefaultMenu>
      <ConfirmDialog
        open={!!controller.confirmDeleteId}
        title="Confirmar remoção"
        message="Tem certeza que deseja remover esta conexão? Essa ação não pode ser desfeita."
        onClose={() => controller.setConfirmDeleteId(null)}
        onConfirm={() =>
          controller.handleRemoveConnection(controller.confirmDeleteId!)
        }
        confirmText="Remover"
        confirmColor="error"
      />
    </>
  );
}
