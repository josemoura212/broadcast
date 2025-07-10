import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Button from "@mui/material/Button";
import { useAuth } from "@/app/context/auth-context";
import { useEffect } from "react";
import { addMessage, Message, updateMessage } from "../message.model";
import { toDate } from "@/core/utils/to-date";
import { useConnectionCtx } from "@/app/context/connection-context";
import { useForm, Controller, useWatch } from "react-hook-form";
import { ControlledTextField } from "@/app/components/controlled-text-field";
import { ControlledSelect } from "@/app/components/controlled-select";
import { useContact } from "@/app/apps/contact/contact.model";

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

  const { user } = useAuth();
  const { conn } = useConnectionCtx();

  const [contacts] = useContact(user?.uid || "", conn?.id || "");

  const { control, handleSubmit, reset, setError } = useForm<MessageFormData>({
    defaultValues: {
      content: "",
      selectedContacts: [],
      scheduledAt: null,
    },
  });
  const scheduledAt = useWatch({ control, name: "scheduledAt" });

  useEffect(() => {
    if (!editingMode) {
      reset({
        content: "",
        selectedContacts: [],
        scheduledAt: null,
      });
      return;
    }
    reset({
      content: message?.content || "",
      selectedContacts: message?.contactIds || [],
      scheduledAt: toDate(message?.scheduledAt) || null,
    });
  }, [editingMode]);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (
          !user ||
          !conn ||
          !data.content.trim() ||
          data.selectedContacts.length === 0
        )
          return;

        try {
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
        } catch (error) {
          setError("content", { message: "Erro ao salvar mensagem" });
        }
      })}
      className="flex gap-3 mb-3 items-start flex-col"
    >
      <ControlledSelect<MessageFormData>
        name="selectedContacts"
        control={control}
        rules={{ required: "Selecione pelo menos um contato" }}
        label="Contatos"
        options={contacts}
        multiple
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
