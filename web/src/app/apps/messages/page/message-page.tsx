import { DefaultMenu } from "@/app/components/default-menu";
import { ActionListItem } from "@/app/components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useState } from "react";
import { Message, sendMessageNow, useMessages } from "../message.model";
import { MessageFilter } from "./message-filter";
import { Contact, useContacts } from "@/app/apps/contacts/contact.model";
import { useAuth } from "@/app/context/auth-context";
import { useConnectionCtx } from "@/app/context/connection-context";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {
  openAddEditMessageDialog,
  openDeleteMessageDialog,
} from "./message.facade";
import { formatDateTimeLocal } from "@/core/utils/date-time";

export function MessagePage() {
  const { user } = useAuth();
  const { conn } = useConnectionCtx();

  const [filter, setFilter] = useState<"enviada" | "agendada" | "all">("all");
  const [contacts] = useContacts(user?.uid || "", conn?.id || "");
  const [messages, loading] = useMessages(
    user?.uid || "",
    conn?.id || "",
    filter !== "all" ? filter : undefined
  );

  return (
    <DefaultMenu>
      <Typography variant="h4" mb={2} textAlign={"center"}>
        Mensagens
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={() => openAddEditMessageDialog()}
        >
          Criar Mensagem
        </Button>
      </Box>
      <Divider />
      <MessageFilter filter={filter} setFilter={setFilter} />
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <Box sx={{ overflowY: "auto" }}>
          <List>
            {messages.map((msg) => (
              <ActionListItem
                key={msg.id}
                primary={msg.content}
                secondary={formatContentMessage(msg, contacts)}
                onDelete={() => openDeleteMessageDialog(msg.id)}
                {...(msg.status === "agendada"
                  ? {
                      onEdit: () => openAddEditMessageDialog(msg),
                      onSendNow: () => sendMessageNow(msg.id),
                    }
                  : {})}
              />
            ))}
            {messages.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhuma mensagem encontrada.
              </Typography>
            )}
          </List>
        </Box>
      )}
    </DefaultMenu>
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
