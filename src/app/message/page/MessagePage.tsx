import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  List,
  ListItem,
  ListItemText as MuiListItemText,
  Stack,
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers";
import { useAuth } from "../../context/AuthContext";
import { formatDateTimeLocal } from "../../../infra/utils/formatDateTimeLocal";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../infra/services/firebase";
import { Contact, getContacts } from "../../contact/domain/models/ContactModel";
import { useSnapshot } from "../../hooks/global-hooks";
import DefaultMenu from "../../components/DefaultMenu";
import { addMessage, Message } from "../domain/models/MessageModel";

const MessagePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"enviada" | "agendada" | "all">("all");
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (user?.uid) {
      getContacts(user.uid).then(setContacts);
    }
  }, [user?.uid]);

  const refMessages = useMemo(() => {
    const messagesRef = collection(
      db,
      `clients/${user?.uid}/messages`
    ) as CollectionReference<Message>;

    if (filter !== "all") {
      return query(
        messagesRef,
        where("status", "==", filter),
        orderBy(filter === "agendada" ? "scheduledAt" : "sentAt", "desc")
      );
    }

    return query(messagesRef, orderBy("sentAt", "desc"));
  }, [user?.uid, filter]);

  const { state: messages, loading } = useSnapshot<Message>(refMessages);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim() || selectedContacts.length === 0) return;

    await addMessage({
      userId: user.uid,
      content: content.trim(),
      contactIds: selectedContacts,
      scheduledAt: scheduledAt ?? undefined,
    });
    setContent("");
    setSelectedContacts([]);
    setScheduledAt(null);
  };

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Enviar Mensagem
        </Typography>
        <form
          onSubmit={handleSend}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Contatos</InputLabel>
            <Select
              multiple
              value={selectedContacts}
              onChange={(e) => setSelectedContacts(e.target.value as string[])}
              input={<OutlinedInput label="Contatos" />}
              renderValue={(selected) =>
                contacts
                  .filter((c) => selected.includes(c.id))
                  .map((c) => c.name)
                  .join(", ")
              }
            >
              {contacts.map((contact) => (
                <MenuItem key={contact.id} value={contact.id}>
                  <Checkbox
                    checked={selectedContacts.indexOf(contact.id) > -1}
                  />
                  <ListItemText primary={contact.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Mensagem"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            required
          />

          <DateTimePicker
            label="Agendar para (opcional)"
            value={scheduledAt}
            onChange={(newValue) => setScheduledAt(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
            minDateTime={new Date()}
          />
          <Button type="submit" variant="contained" color="primary">
            {scheduledAt ? "Agendar Mensagem" : "Enviar Mensagem"}
          </Button>
        </form>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={filter === "all" ? "contained" : "outlined"}
            onClick={() => setFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={filter === "enviada" ? "contained" : "outlined"}
            onClick={() => setFilter("enviada")}
          >
            Enviadas
          </Button>
          <Button
            variant={filter === "agendada" ? "contained" : "outlined"}
            onClick={() => setFilter("agendada")}
          >
            Agendadas
          </Button>
        </Stack>
        <Typography variant="h6" mb={1}>
          Mensagens
        </Typography>
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "40vh", overflowY: "auto" }}>
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id} divider>
                  <MuiListItemText
                    primary={msg.content}
                    secondary={
                      `Status: ${msg.status} | Para: ${contacts
                        .filter((c) => msg.contactIds.includes(c.id))
                        .map((c) => c.name)
                        .join(", ")} | ` +
                      (msg.status === "agendada"
                        ? `\nAgendada para: ${formatDateTimeLocal(
                            msg.scheduledAt
                          )}`
                        : `\nEnviada em: ${formatDateTimeLocal(msg.sentAt)}`)
                    }
                  />
                </ListItem>
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
    </>
  );
};

export default MessagePage;
