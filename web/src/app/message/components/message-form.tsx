import FormControl from "@mui/material/FormControl";
import { useMessagePage } from "../page/use-message-page";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Button from "@mui/material/Button";
import { useAuth } from "@/app/context/auth-context";
import { useEffect } from "react";
import { addMessage, Message, updateMessage } from "../message.model";
import { toDate } from "@/infra/utils/to-date";
import { useConnection } from "@/app/context/connection-context";
import { useForm, Controller, useWatch } from "react-hook-form";
import { ControlledTextField } from "@/app/components/controlled-text-field";

interface MessageFormProps {
  message?: Message | null;
  editingMode: boolean;
  setEditingMode: (editing: boolean) => void;
}

interface MessageFormData {
  content: string;
  selectedContacts: string[];
  scheduledAt: Date | null;
}

export function MessageForm(props: MessageFormProps) {
  const { editingMode, setEditingMode, message } = props;

  const controller = useMessagePage();
  const { user } = useAuth();
  const { conn } = useConnection();
  const contacts = controller.contacts;

  const { control, handleSubmit, reset, setValue } = useForm<MessageFormData>({
    defaultValues: {
      content: "",
      selectedContacts: [],
      scheduledAt: null,
    },
  });

  const scheduledAt = useWatch({ control, name: "scheduledAt" });

  useEffect(() => {
    if (editingMode && message) {
      setValue("content", message.content);
      setValue("selectedContacts", message.contactIds);
      setValue("scheduledAt", toDate(message.scheduledAt) ?? null);
    }
    if (!editingMode) {
      reset();
    }
  }, [editingMode, message, setValue, reset]);

  async function onSubmit(data: MessageFormData) {
    if (
      !user ||
      !conn ||
      !data.content.trim() ||
      data.selectedContacts.length === 0
    )
      return;

    if (editingMode) {
      if (!message) return;
      await updateMessage(message.id, {
        content: data.content.trim(),
        contactIds: data.selectedContacts,
        scheduledAt: data.scheduledAt ?? undefined,
      });
      setEditingMode(false);
    } else {
      await addMessage({
        userId: user.uid,
        connectionId: conn.id,
        content: data.content.trim(),
        contactIds: data.selectedContacts,
        scheduledAt: data.scheduledAt ?? undefined,
      });
    }
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-3 mb-3 items-start flex-col"
    >
      <Controller
        name="selectedContacts"
        control={control}
        rules={{ required: "Selecione pelo menos um contato" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <InputLabel>Contatos</InputLabel>
            <Select
              multiple
              value={field.value}
              onChange={(e) => field.onChange(e.target.value as string[])}
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
                  <Checkbox checked={field.value.indexOf(contact.id) > -1} />
                  <ListItemText primary={contact.name} />
                </MenuItem>
              ))}
            </Select>
            {error && (
              <span
                style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}
              >
                {error.message}
              </span>
            )}
          </FormControl>
        )}
      />

      <ControlledTextField<MessageFormData>
        name="content"
        control={control}
        rules={{ required: "Mensagem é obrigatória" }}
        label="Mensagem"
        multiline
        minRows={2}
      />

      <Controller
        name="scheduledAt"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="Agendar para (opcional)"
            value={field.value}
            onChange={(newValue) => field.onChange(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
            minDateTime={new Date()}
          />
        )}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editingMode
          ? "Salvar"
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
