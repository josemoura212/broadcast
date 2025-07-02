import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface FieldConfig {
  label: string;
  name: string;
  value: string;
  type?: string;
}

interface InlineEditFieldsProps {
  fields: FieldConfig[];
  onChange: (name: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function InlineEditFields(props: InlineEditFieldsProps) {
  const { fields, onChange, onSave, onCancel, saving } = props;
  return (
    <>
      {fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          value={field.value}
          onChange={(e) => onChange(field.name, e.target.value)}
          size="small"
          sx={{ mr: 1, flex: 1 }}
          fullWidth
          type={field.type || "text"}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{ mr: 1 }}
        onClick={onSave}
        disabled={saving}
      >
        Salvar
      </Button>
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={onCancel}
        disabled={saving}
      >
        Cancelar
      </Button>
    </>
  );
}
