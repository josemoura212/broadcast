import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?:
    | "primary"
    | "error"
    | "inherit"
    | "secondary"
    | "success"
    | "info"
    | "warning";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirmar ação",
  message,
  onClose,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "error",
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} color={confirmColor} variant="contained">
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
