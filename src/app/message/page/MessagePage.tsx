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
  Stack,
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers";
import { useAuth } from "../../context/AuthContext";
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
import {
  addMessage,
  Message,
  updateMessage,
  deleteMessage,
} from "../domain/models/MessageModel";
import ConfirmDialog from "../../components/ConfirmDialog";
import DialogEditingMessage from "../components/DialogEditingMessage";
import ListItemEditDelete from "../../components/ListItemEditDelete";
import { toDate } from "../../../infra/utils/to-date";
import { formatDateTimeLocal } from "../../../infra/utils/format-date-time-local";

const MessagePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"enviada" | "agendada" | "all">("all");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{
    content: string;
    scheduledAt: Date | null;
    contactIds: string[];
  }>({
    content: "",
    scheduledAt: null,
    contactIds: [],
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string>("");

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
        orderBy("createdAt", "desc")
      );
    }

    return query(messagesRef, orderBy("createdAt", "desc"));
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

  const handleStartEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditingMessage({
      content: msg.content,
      scheduledAt: toDate(msg.scheduledAt) ?? null,
      contactIds: msg.contactIds ?? [],
    });
    setEditError("");
  };

  const handleEditChange = (
    fields: Partial<{
      content: string;
      scheduledAt: Date | null;
      contactIds: string[];
    }>
  ) => {
    setEditingMessage((prev) => ({ ...prev, ...fields }));
  };

  const handleSaveEdit = async () => {
    if (
      !user ||
      !editingId ||
      !editingMessage.content.trim() ||
      editingMessage.contactIds.length === 0
    )
      return;
    try {
      await updateMessage(user.uid, editingId, {
        content: editingMessage.content.trim(),
        scheduledAt: editingMessage.scheduledAt ?? undefined,
        contactIds: editingMessage.contactIds,
      });
      setEditingId(null);
      setEditingMessage({ content: "", scheduledAt: null, contactIds: [] });
      setEditError("");
    } catch (e: any) {
      setEditError(e.message || "Erro ao editar mensagem");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingMessage({ content: "", scheduledAt: null, contactIds: [] });
    setEditError("");
  };

  const handleRemoveMessage = async (id: string) => {
    if (!user) return;
    await deleteMessage(user.uid, id);
    setConfirmDeleteId(null);
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
              required
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
          <Box sx={{ overflowY: "auto" }}>
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id} divider>
                  <ListItemEditDelete
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
                    {...(msg.status === "agendada"
                      ? {
                          onEdit: () => handleStartEdit(msg),
                          editLabel: "Editar",
                        }
                      : {})}
                    onDelete={() => setConfirmDeleteId(msg.id)}
                    deleteLabel="Remover"
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
        <ConfirmDialog
          open={!!confirmDeleteId}
          title="Confirmar remoção"
          message="Tem certeza que deseja remover esta mensagem? Essa ação não pode ser desfeita."
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={() => handleRemoveMessage(confirmDeleteId!)}
          confirmText="Remover"
          confirmColor="error"
        />
        {editError && (
          <Typography color="error" variant="body2" mt={1}>
            {editError}
          </Typography>
        )}
        <DialogEditingMessage
          open={!!editingId}
          value={editingMessage}
          contacts={contacts}
          onChange={handleEditChange}
          onClose={handleCancelEdit}
          onSave={handleSaveEdit}
          saving={false}
          error={editError}
          agendada={
            messages.find((m) => m.id === editingId)?.status === "agendada"
          }
        />
      </DefaultMenu>
    </>
  );
};

export default MessagePage;
