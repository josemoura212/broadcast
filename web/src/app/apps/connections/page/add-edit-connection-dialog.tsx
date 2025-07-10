import Paper from "@mui/material/Paper";
import {
  addConnection,
  Connection,
  updateConnection,
} from "../connection.model";
import { memo } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "@/app/components/controlled-text-field";
import Button from "@mui/material/Button";
import { useCloseDialog } from "../../dialog/dialog-app";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Lan } from "@mui/icons-material";

function AddEditConnectionDialog({ connection }: { connection?: Connection }) {
  const { user } = useAuth();
  const { handleSubmit, setError, control } = useForm({
    defaultValues: {
      name: connection?.name || "",
    },
  });

  const closeDialog = useCloseDialog();

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
        <Lan sx={{ fontSize: 35 }} />
        <Typography variant="h6">
          {connection ? "Editar Conexão" : "Adicionar Conexão"}
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (!user) return;

          try {
            if (connection) {
              if (!connection) return;
              await updateConnection(connection?.id, data.name.trim());
            } else {
              await addConnection(user.uid, data.name.trim());
            }
            closeDialog();
          } catch (error) {
            setError("name", { message: "Erro ao salvar conexão" });
          }
        })}
        className="flex gap-3 flex-col"
      >
        <ControlledTextField
          name="name"
          control={control}
          rules={{ required: "Nome da conexão obrigatório" }}
          label="Nome da conexão"
          autoFocus
        />
        <Button type="submit" variant="contained" color="primary">
          {connection ? "Salvar" : "Adicionar"}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={closeDialog}
          sx={{ mt: 3 }}
        >
          Cancelar
        </Button>
      </form>
    </Paper>
  );
}

export default memo(AddEditConnectionDialog);
