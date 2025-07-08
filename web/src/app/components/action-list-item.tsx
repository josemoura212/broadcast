import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow,
} from "@mui/icons-material";

import { ListItem, ListItemText, IconButton, Tooltip } from "@mui/material";

interface ActionListItemProps {
  primary: string;
  secondary?: string;
  onEdit?: () => void;
  onDelete: () => void;
  onSendNow?: () => void;
  divider?: boolean;
}

export function ActionListItem(props: ActionListItemProps) {
  const {
    primary,
    secondary,
    onEdit,
    onDelete,
    onSendNow,
    divider = true,
  } = props;
  ActionListItem;
  return (
    <ListItem divider={divider}>
      <ListItemText primary={primary} secondary={secondary} />
      {onSendNow && (
        <Tooltip title="Enviar agora" arrow>
          <IconButton onClick={onSendNow} color="warning" disabled={!onSendNow}>
            <PlayArrow />
          </IconButton>
        </Tooltip>
      )}
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
