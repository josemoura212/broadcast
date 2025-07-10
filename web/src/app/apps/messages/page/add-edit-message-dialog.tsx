import { useAuth } from "@/app/context/auth-context";
import { addMessage, Message, updateMessage } from "../message.model";
import { useConnectionCtx } from "@/app/context/connection-context";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useContacts } from "../../contacts/contact.model";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Message as MessageIcon } from "@mui/icons-material";
import { memo } from "react";
import { ControlledSelect } from "@/app/components/controlled-select";
import { ControlledTextField } from "@/app/components/controlled-text-field";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Button from "@mui/material/Button";
import { useCloseDialog } from "../../dialog/dialog-app";
import { toDate } from "@/core/utils/date-time";

function AddEditMessageDialog({ message }: { message?: Message }) {
  const { user } = useAuth();
  const { conn } = useConnectionCtx();
  const closeDialog = useCloseDialog();

  const [contacts] = useContacts(user?.uid || "", conn?.id || "");

  const { control, handleSubmit, setError } = useForm({
    defaultValues: {
      content: message?.content || "",
      selectedContacts: message?.contactIds || [],
      scheduledAt: toDate(message?.scheduledAt) || null,
    },
  });

  const scheduledAt = useWatch({ control, name: "scheduledAt" });

  return (
    <Paper
      elevation={3}
      className="p-4"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "100%",
      }}
    >
      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <MessageIcon sx={{ fontSize: 35 }} />
        <Typography variant="h6">
          {message ? "Editar Mensagem" : "Adicionar Mensagem"}
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (!user || !conn) {
            return;
          }

          try {
            if (message) {
              await updateMessage(message.id, {
                content: data.content.trim(),
                contactIds: data.selectedContacts,
                scheduledAt: data.scheduledAt ?? undefined,
              });
            } else {
              await addMessage({
                userId: user.uid,
                connectionId: conn.id,
                content: data.content.trim(),
                contactIds: data.selectedContacts,
                scheduledAt: data.scheduledAt ?? undefined,
              });
            }
            closeDialog();
          } catch (error) {
            setError("content", { message: "Erro ao salvar mensagem" });
          }
        })}
        className="flex gap-3 mb-3 items-start flex-col"
      >
        <ControlledSelect
          name="selectedContacts"
          control={control}
          rules={{ required: "Selecione pelo menos um contato" }}
          label="Contatos"
          options={contacts}
          multiple
        />

        <ControlledTextField
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
              minDateTime={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
                popper: {
                  placement: "right",
                },
              }}
            />
          )}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {message
            ? "Salvar"
            : scheduledAt
            ? "Agendar Mensagem"
            : "Enviar Mensagem"}
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={closeDialog}
        >
          Cancelar
        </Button>
      </form>
    </Paper>
  );
}

export default memo(AddEditMessageDialog);
