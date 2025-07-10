import { DefaultMenu } from "@/app/components/default-menu";
import { ConfirmDialog } from "@/app/components/confirm-dialog";
import { ActionListItem } from "@/app/components/action-list-item";
import { formatDateTimeLocal } from "@/core/utils/format-date-time-local";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useMessagePage } from "./use-message-page";
import { MessageForm } from "../components/message-form";
import { useState } from "react";
import { Message } from "../message.model";
import { MessageFilter } from "../components/message-filter";
import { Contact } from "@/app/apps/contact/contact.model";

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
            <MessageFilter
              filter={controller.filter}
              setFilter={controller.setFilter}
            />
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
                    secondary={formatContentMessage(msg, controller.contacts)}
                    onDelete={() => controller.setConfirmDeleteId(msg.id)}
                    {...(msg.status === "agendada"
                      ? {
                          onEdit: () => onEditMessage(msg),
                          onSendNow: () => controller.handleSendNow(msg.id),
                        }
                      : {})}
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

function formatContentMessage(msg: Message, contacts: Contact[]) {
  return (
    `Status: ${msg.status} | Para: ${contacts
      .filter((c) => msg.contactIds.includes(c.id))
      .map((c) => c.name)
      .join(", ")} | ` +
    (msg.status === "agendada"
      ? `Agendada para: ${formatDateTimeLocal(msg.scheduledAt)}`
      : `Enviada em: ${formatDateTimeLocal(msg.sentAt)}`)
  );
}
