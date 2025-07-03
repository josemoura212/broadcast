import { DefaultMenu } from "../../components/default-menu";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { ActionListItem } from "../../components/action-list-item";
import { formatDateTimeLocal } from "@/infra/utils/format-date-time-local";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useMessagePage } from "./use-message-page";
import { MessageForm } from "../components/message-form";
import { useState } from "react";
import { Message } from "../message.model";

export function MessagePage() {
  const controller = useMessagePage();

  const [editingMode, setEditingMode] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  function onEditMessage(msg: Message) {
    setEditingMode(true);
    setEditingMessage(msg);
  }

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Enviar Mensagem
        </Typography>
        <MessageForm
          editingMode={editingMode}
          setEditingMode={setEditingMode}
          message={editingMessage}
        />
        {!editingMode && (
          <>
            <Stack direction="row" spacing={2} mb={2}>
              <Button
                variant={controller.filter === "all" ? "contained" : "outlined"}
                onClick={() => controller.setFilter("all")}
              >
                Todas
              </Button>
              <Button
                variant={
                  controller.filter === "enviada" ? "contained" : "outlined"
                }
                onClick={() => controller.setFilter("enviada")}
              >
                Enviadas
              </Button>
              <Button
                variant={
                  controller.filter === "agendada" ? "contained" : "outlined"
                }
                onClick={() => controller.setFilter("agendada")}
              >
                Agendadas
              </Button>
            </Stack>
            <Typography variant="h6" mb={1}>
              Mensagens
            </Typography>
          </>
        )}
        {!editingMode &&
          (controller.loading ? (
            <Typography>Carregando...</Typography>
          ) : (
            <Box sx={{ overflowY: "auto" }}>
              <List>
                {controller.messages.map((msg) => (
                  <ActionListItem
                    key={msg.id}
                    primary={msg.content}
                    secondary={
                      `Status: ${msg.status} | Para: ${controller.contacts
                        .filter((c) => msg.contactIds.includes(c.id))
                        .map((c) => c.name)
                        .join(", ")} | ` +
                      (msg.status === "agendada"
                        ? `\nAgendada para: ${formatDateTimeLocal(
                            msg.scheduledAt
                          )}`
                        : `\nEnviada em: ${formatDateTimeLocal(msg.sentAt)}`)
                    }
                    {...(msg.status === "agendada"
                      ? {
                          onEdit: () => onEditMessage(msg),
                          onSendNow: () => controller.handleSendNow(msg.id),
                        }
                      : {})}
                    onDelete={() => controller.setConfirmDeleteId(msg.id)}
                    divider={true}
                  />
                ))}
                {controller.messages.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma mensagem encontrada.
                  </Typography>
                )}
              </List>
            </Box>
          ))}
        <ConfirmDialog
          open={!!controller.confirmDeleteId}
          title="Confirmar remoção"
          message="Tem certeza que deseja remover esta mensagem? Essa ação não pode ser desfeita."
          onClose={() => controller.setConfirmDeleteId(null)}
          onConfirm={() =>
            controller.handleRemoveMessage(controller.confirmDeleteId!)
          }
          confirmText="Remover"
          confirmColor="error"
        />
      </DefaultMenu>
    </>
  );
}
