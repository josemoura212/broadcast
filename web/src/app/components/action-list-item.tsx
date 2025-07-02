import { ListItem, ListItemText, Button } from "@mui/material";

interface ActionListItemProps {
  primary: string;
  secondary?: string;
  onEdit?: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  divider?: boolean;
}

export function ActionListItem(props: ActionListItemProps) {
  const {
    primary,
    secondary,
    onEdit,
    onDelete,
    editLabel = "Editar",
    deleteLabel = "Remover",
    divider = false,
  } = props;
  ActionListItem;
  return (
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
}
