import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ControlledTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name" | "error" | "helperText"> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: any;
  numbersOnly?: boolean;
}

export function ControlledTextField<T extends FieldValues>({
  name,
  control,
  rules,
  type,
  numbersOnly = false,
  ...textFieldProps
}: ControlledTextFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  function handleTogglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const passwordProps =
    type === "password"
      ? {
          slotProps: {
            input: {
              ...textFieldProps.slotProps?.input,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          },
        }
      : {};

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value || ""}
          onChange={(e) => {
            if (numbersOnly) {
              const numbersOnly = e.target.value.replace(/\D/g, "");
              field.onChange(numbersOnly);
            } else {
              field.onChange(e.target.value);
            }
          }}
          {...textFieldProps}
          {...passwordProps}
          type={inputType}
          error={!!error}
          helperText={error?.message}
          size="small"
          fullWidth
        />
      )}
    />
  );
}
