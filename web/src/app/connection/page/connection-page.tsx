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
import { useConnectionPage } from "./use-connection-page";

export function ConnectionPage() {
  const { controller } = useConnectionPage();

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Minhas Conexões
        </Typography>
        <form
          onSubmit={controller.handleAddConnection}
          className="flex gap-3 mb-3 items-start"
        >
          <TextField
            label="Nome da conexão"
            value={controller.newConnection}
            onChange={(e) => controller.setNewConnection(e.target.value)}
            size="small"
            fullWidth
            required
            autoFocus
          />
          <Button type="submit" variant="contained" color="primary">
            Adicionar
          </Button>
        </form>
        {controller.loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {controller.connections.map((conn) =>
                controller.editingId === conn.id ? (
                  <ListItem key={conn.id} divider>
                    <InlineEditFields
                      fields={[
                        {
                          label: "Nome",
                          name: "name",
                          value: controller.editingName,
                        },
                      ]}
                      onChange={(_, value) => controller.setEditingName(value)}
                      onSave={controller.handleSaveEdit}
                      onCancel={controller.handleCancelEdit}
                    />
                  </ListItem>
                ) : (
                  <ActionListItem
                    key={conn.id}
                    primary={conn.name}
                    onEdit={() =>
                      controller.handleStartEdit(conn.id, conn.name)
                    }
                    onDelete={() => controller.setConfirmDeleteId(conn.id)}
                    divider={true}
                  />
                )
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
