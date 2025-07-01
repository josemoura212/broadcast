import React from "react";
import { ListItem, ListItemText, Button } from "@mui/material";

interface ListItemEditDeleteProps {
  primary: string;
  secondary?: string;
  onEdit?: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  divider?: boolean;
}

const ListItemEditDelete: React.FC<ListItemEditDeleteProps> = ({
  primary,
  secondary,
  onEdit,
  onDelete,
  editLabel = "Editar",
  deleteLabel = "Remover",
  divider = false,
}) => (
  <ListItem divider={divider}>
    <ListItemText primary={primary} secondary={secondary} />
    {onEdit && (
      <Button
        variant="outlined"
        color="primary"
        size="small"
        sx={{ mr: 1 }}
        onClick={onEdit}
        disabled={!onEdit}
      >
        {editLabel}
      </Button>
    )}
    <Button variant="outlined" color="error" size="small" onClick={onDelete}>
      {deleteLabel}
    </Button>
  </ListItem>
);

export default ListItemEditDelete;
