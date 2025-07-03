import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { ListItem, ListItemText, IconButton, Tooltip } from "@mui/material";

interface ActionListItemProps {
  primary: string;
  secondary?: string;
  onEdit?: () => void;
  onDelete: () => void;
  divider?: boolean;
}

export function ActionListItem(props: ActionListItemProps) {
  const { primary, secondary, onEdit, onDelete, divider = false } = props;
  ActionListItem;
  return (
    <ListItem divider={divider}>
      <ListItemText primary={primary} secondary={secondary} />
      {onEdit && (
        <Tooltip title="Editar" arrow>
          <IconButton onClick={onEdit} disabled={!onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Remover" arrow>
        <IconButton onClick={onDelete} color="error" disabled={!onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}
