import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface ConfirmDialogProps {
  title?: string;
  message: string;
  onClickConfirm: () => void;
  onClose: () => void;
  confirmColor?: "error" | "primary" | "secondary" | "inherit";
  confirmText?: string;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    message,
    onClickConfirm,
    onClose,
    title = "Confirmar exclusão",
    confirmColor = "error",
    confirmText = "Remover",
  } = props;

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        minWidth: "300px",
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">{title}</Typography>
        <Typography>{message}</Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button color="inherit" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={confirmColor}
            onClick={onClickConfirm}
          >
            {confirmText}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
