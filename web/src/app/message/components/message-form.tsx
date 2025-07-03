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

export function MessageForm() {
  const controller = useMessagePage();

  return (
    <form
      onSubmit={controller.handleSend}
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
          value={controller.selectedContacts}
          onChange={(e) =>
            controller.setSelectedContacts(e.target.value as string[])
          }
          input={<OutlinedInput label="Contatos" />}
          renderValue={(selected) =>
            controller.contacts
              .filter((c) => selected.includes(c.id))
              .map((c) => c.name)
              .join(", ")
          }
        >
          {controller.contacts.map((contact) => (
            <MenuItem key={contact.id} value={contact.id}>
              <Checkbox
                checked={controller.selectedContacts.indexOf(contact.id) > -1}
              />
              <ListItemText primary={contact.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Mensagem"
        value={controller.content}
        onChange={(e) => controller.setContent(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        required
      />

      <DateTimePicker
        label="Agendar para (opcional)"
        value={controller.scheduledAt}
        onChange={(newValue) => controller.setScheduledAt(newValue)}
        slotProps={{ textField: { fullWidth: true } }}
        minDateTime={new Date()}
      />
      <Button type="submit" variant="contained" color="primary">
        {controller.scheduledAt ? "Agendar Mensagem" : "Enviar Mensagem"}
      </Button>
    </form>
  );
}
