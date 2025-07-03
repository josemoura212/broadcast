import FormControl from "@mui/material/FormControl";
import { useMessagePage } from "../page/use-message-page";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Button from "@mui/material/Button";
import { useAuth } from "@/app/context/auth-context";
import { useEffect, useState } from "react";
import { addMessage, Message, updateMessage } from "../message.model";
import { toDate } from "@/infra/utils/to-date";

interface MessageFormProps {
  message?: Message | null;
  editingMode: boolean;
  setEditingMode: (editing: boolean) => void;
}

export function MessageForm({
  editingMode,
  setEditingMode,
  message,
}: MessageFormProps) {
  const controller = useMessagePage();
  const { user } = useAuth();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const contacts = controller.contacts;

  useEffect(() => {
    if (editingMode && message) {
      setContent(message.content);
      setSelectedContacts(message.contactIds);
      setScheduledAt(toDate(message.scheduledAt) ?? null);
    }
    if (!editingMode) {
      setContent("");
      setSelectedContacts([]);
      setScheduledAt(null);
    }
  }, [editingMode, message]);

  async function handleSend(e: React.FormEvent) {
    if (editingMode) {
      if (!message) return;
      e.preventDefault();
      await updateMessage(message.id, {
        content: content.trim(),
        contactIds: selectedContacts,
        scheduledAt: scheduledAt ?? undefined,
      });
      setEditingMode(false);
      setContent("");
      setSelectedContacts([]);
      setScheduledAt(null);
      return;
    }
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
  }

  return (
    <form
      onSubmit={handleSend}
      className="flex gap-3 mb-3 items-start flex-col"
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
              <Checkbox checked={selectedContacts.indexOf(contact.id) > -1} />
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
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editingMode
          ? "salvar"
          : scheduledAt
          ? "Agendar Mensagem"
          : "Enviar Mensagem"}
      </Button>
      {editingMode && (
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => setEditingMode(false)}
        >
          Cancelar
        </Button>
      )}
    </form>
  );
}
