import React from "react";
import { TextField, Button } from "@mui/material";

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

const InlineEditFields: React.FC<InlineEditFieldsProps> = ({
  fields,
  onChange,
  onSave,
  onCancel,
  saving,
}) => (
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
      variant="outlined"
      color="inherit"
      size="small"
      onClick={onCancel}
      disabled={saving}
    >
      Cancelar
    </Button>
  </>
);

export default InlineEditFields;
