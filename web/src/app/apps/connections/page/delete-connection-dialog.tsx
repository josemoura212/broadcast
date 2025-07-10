import Paper from "@mui/material/Paper";
import { deleteConnection } from "../connection.model";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "node_modules/@mui/material/esm/Button/Button";
import { useCloseDialog } from "../../dialog/dialog-app";
import { memo } from "react";

function DeleteConnectionDialog({ connectionId }: { connectionId: string }) {
  const closeDialog = useCloseDialog();

  async function handleRemoveConnection() {
    await deleteConnection(connectionId);
  }

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        minWidth: "300px",
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">Confirmar remoção</Typography>
        <Typography>
          Tem certeza que deseja remover essa conexão? Essa ação não pode ser
          desfeita.
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button color="inherit" onClick={() => closeDialog()}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveConnection}
          >
            Remover
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default memo(DeleteConnectionDialog);
