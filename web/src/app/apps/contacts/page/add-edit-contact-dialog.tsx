import { useAuth } from "@/app/context/auth-context";
import { useConnectionCtx } from "@/app/context/connection-context";
import { addContact, Contact, updateContact } from "../contact.model";
import { useForm } from "react-hook-form";
import { memo, useEffect } from "react";
import { ControlledTextField } from "@/app/components/controlled-text-field";
import Button from "@mui/material/Button";
import { useCloseDialog } from "../../dialog/dialog-app";
import Paper from "@mui/material/Paper";
import { ContactPage } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

function AddEditContactDialog({ contact }: { contact?: Partial<Contact> }) {
  const { user } = useAuth();
  const { conn } = useConnectionCtx();
  const closeDialog = useCloseDialog();

  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: {
      name: contact?.name || "",
      phone: contact?.phone || "",
    },
  });

  useEffect(() => {
    if (!contact) {
      reset({ name: "", phone: "" });
      return;
    }
    reset({ name: contact?.name || "", phone: contact?.phone || "" });
  }, [contact]);

  return (
    <Paper
      elevation={3}
      className="p-4"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "100%",
        minHeight: "300px",
      }}
    >
      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <ContactPage sx={{ fontSize: 35 }} />
        <Typography variant="h6">
          {contact ? "Editar Contato" : "Adicionar Contato"}
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (!user || !data.name.trim() || !data.phone.trim() || !conn) {
            return;
          }

          try {
            if (contact) {
              if (!contact) return;
              await updateContact(contact.id || "", {
                name: data.name.trim(),
                phone: data.phone.trim(),
              });
            } else {
              await addContact({
                connectionId: conn?.id,
                userId: user.uid,
                name: data.name.trim(),
                phone: data.phone.trim(),
              });
            }
            closeDialog();
          } catch (error) {
            setError("name", { message: "Erro ao salvar contato" });
          }
        })}
        className="flex gap-3 mb-3 items-start flex-col"
      >
        <ControlledTextField
          name="name"
          control={control}
          rules={{ required: "Nome do contato é obrigatório" }}
          label="Nome do contato"
          autoFocus
        />
        <ControlledTextField
          name="phone"
          control={control}
          rules={{ required: "Telefone é obrigatório" }}
          label="Telefone"
          numbersOnly
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {contact ? "Salvar" : "Adicionar"}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 3 }}
          onClick={closeDialog}
        >
          Cancelar
        </Button>
      </form>
    </Paper>
  );
}

export default memo(AddEditContactDialog);
