import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Contact } from "../../contact/domain/models/ContactModel";

interface DialogEditingMessageProps {
  open: boolean;
  value: {
    content: string;
    scheduledAt: Date | null;
    contactIds: string[];
  };
  contacts: Contact[];
  onChange: (
    fields: Partial<{
      content: string;
      scheduledAt: Date | null;
      contactIds: string[];
    }>
  ) => void;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  error?: string;
  agendada?: boolean;
}

const DialogEditingMessage: React.FC<DialogEditingMessageProps> = ({
  open,
  value,
  contacts,
  onChange,
  onClose,
  onSave,
  saving,
  error,
  agendada = true,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Editar Mensagem</DialogTitle>
    <DialogContent>
      <Stack spacing={2} mt={1}>
        <TextField
          label="Mensagem"
          value={value.content}
          onChange={(e) => onChange({ content: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        <FormControl fullWidth>
          <InputLabel>Contatos</InputLabel>
          <Select
            multiple
            value={value.contactIds}
            onChange={(e) =>
              onChange({ contactIds: e.target.value as string[] })
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
                <Checkbox checked={value.contactIds.indexOf(contact.id) > -1} />
                <ListItemText primary={contact.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {agendada && (
          <DateTimePicker
            label="Agendar para"
            value={value.scheduledAt}
            onChange={(date) => onChange({ scheduledAt: date })}
            slotProps={{ textField: { fullWidth: true } }}
            minDateTime={new Date()}
          />
        )}
        {error && <span style={{ color: "red" }}>{error}</span>}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit" disabled={saving}>
        Cancelar
      </Button>
      <Button
        onClick={onSave}
        color="primary"
        variant="contained"
        disabled={saving}
      >
        Salvar
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogEditingMessage;
