import React from "react";
import { ListItem, ListItemText, Button } from "@mui/material";

interface ListItemEditDeleteProps {
  primary: string;
  secondary?: string;
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

const ListItemEditDelete: React.FC<ListItemEditDeleteProps> = ({
  primary,
  secondary,
  onEdit,
  onDelete,
  editLabel = "Editar",
  deleteLabel = "Remover",
}) => (
  <ListItem>
    <ListItemText primary={primary} secondary={secondary} />
    <Button
      variant="outlined"
      color="primary"
      size="small"
      sx={{ mr: 1 }}
      onClick={onEdit}
    >
      {editLabel}
    </Button>
    <Button variant="outlined" color="error" size="small" onClick={onDelete}>
      {deleteLabel}
    </Button>
  </ListItem>
);

export default ListItemEditDelete;
