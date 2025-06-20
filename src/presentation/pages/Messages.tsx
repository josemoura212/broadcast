import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
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
import AppBarComponent from "../components/AppBarComponent";
import { useContacts } from "../hooks/useContacts";
import { useMessages } from "../hooks/useMessages";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useAuth } from "../context/AuthContext";
import { AddMessage } from "../../domain/usecases/AddMessage";
import { FirebaseMessageRepository } from "../../data/repositories/FirebaseMessageRepository";
import { formatDateTimeLocal } from "../../infra/utils/formatDateTimeLocal";

const Messages: React.FC = () => {
  const { user } = useAuth();
  const { contacts } = useContacts(user?.uid);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"enviada" | "agendada" | "all">("all");
  const { messages, loading, refetch } = useMessages(
    user?.uid,
    filter !== "all" ? filter : undefined
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim() || selectedContacts.length === 0) return;
    const repo = new FirebaseMessageRepository();
    const usecase = new AddMessage(repo);
    await usecase.execute({
      userId: user.uid,
      content: content.trim(),
      contactIds: selectedContacts,
      scheduledAt: scheduledAt ?? undefined,
    });
    setContent("");
    setSelectedContacts([]);
    setScheduledAt(null);
    refetch();
  };

  return (
    <>
      <AppBarComponent />
      <Box maxWidth={600} mx="auto" mt={4}>
        <Paper sx={{ p: 3 }}>
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
                onChange={(e) =>
                  setSelectedContacts(e.target.value as string[])
                }
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
                        (msg.status === "agendada" &&
                        msg.scheduledAt instanceof Date
                          ? `\nAgendada para: ${formatDateTimeLocal(
                              msg.scheduledAt
                            )}`
                          : msg.sentAt instanceof Date
                          ? `\nEnviada em: ${formatDateTimeLocal(msg.sentAt)}`
                          : "")
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
        </Paper>
      </Box>
    </>
  );
};

export default Messages;
