import { Contact } from "@/app/contact/contact.model";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { DateTimePicker } from "@mui/x-date-pickers";

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
  onSendNow?: () => void;
}

export function DialogEditingMessage(props: DialogEditingMessageProps) {
  const {
    open,
    value,
    contacts,
    onChange,
    onClose,
    onSave,
    saving,
    error,
    agendada = true,
    onSendNow,
  } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
                  <Checkbox
                    checked={value.contactIds.indexOf(contact.id) > -1}
                  />
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
        <Button
          color="primary"
          variant="contained"
          onClick={onSendNow}
          disabled={saving}
        >
          Enviar Agora
        </Button>
        <Box sx={{ flexGrow: 1 }} />
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
}
