import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";

interface SelectOption {
  id: string;
  name: string;
}

interface ControlledSelectProps<T extends FieldValues>
  extends Omit<
    SelectProps,
    "name" | "error" | "value" | "onChange" | "multiple"
  > {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: any;
  label: string;
  options: SelectOption[];
  multiple?: boolean;
  renderValue?: (selected: any) => string;
}

export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  options,
  multiple = false,
  renderValue,
  ...selectProps
}: ControlledSelectProps<T>) {
  const getSafeValue = (value: any) => {
    if (multiple) {
      if (!Array.isArray(value)) return [];
      return value.filter((v) => options.some((option) => option.id === v));
    } else {
      if (!value) return "";
      return options.some((option) => option.id === value) ? value : "";
    }
  };

  const defaultRenderValue = (selected: any) => {
    if (multiple) {
      if (!Array.isArray(selected) || selected.length === 0) return "";
      return options
        .filter((option) => selected.includes(option.id))
        .map((option) => option.name)
        .join(", ");
    } else {
      const option = options.find((opt) => opt.id === selected);
      return option?.name || "";
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const safeValue = getSafeValue(field.value);
        const hasValue = multiple ? safeValue.length > 0 : safeValue !== "";

        return (
          <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel shrink={hasValue || undefined}>{label}</InputLabel>
            <Select
              {...field}
              value={safeValue}
              onChange={(e) => field.onChange(e.target.value)}
              multiple={multiple}
              input={<OutlinedInput label={label} />}
              renderValue={renderValue || defaultRenderValue}
              displayEmpty={!multiple}
              {...selectProps}
            >
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {multiple && (
                    <Checkbox
                      checked={
                        Array.isArray(safeValue) &&
                        safeValue.indexOf(option.id) > -1
                      }
                    />
                  )}
                  <ListItemText primary={option.name} />
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}
