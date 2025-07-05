import { useAuth } from "@/app/context/auth-context";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "@/app/components/controlled-text-field";
import {
  addConnection,
  Connection,
  updateConnection,
} from "../connection.model";

interface ConnectionFormProps {
  connection?: Connection | null;
  editingMode: boolean;
  setEditingMode: (editing: boolean) => void;
}

interface ConnectionFormData {
  name: string;
}

export function ConnectionForm(props: ConnectionFormProps) {
  const { editingMode, setEditingMode, connection } = props;
  const { user } = useAuth();

  const { handleSubmit, setError, reset, control } =
    useForm<ConnectionFormData>();

  useEffect(() => {
    if (editingMode && connection) {
      reset({ name: connection.name });
    } else {
      reset({ name: "" });
    }
  }, [editingMode, connection, reset]);

  async function onSubmit(data: ConnectionFormData) {
    if (!user) return;

    try {
      if (editingMode) {
        if (!connection) return;
        await updateConnection(connection.id, data.name.trim());
        setEditingMode(false);
      } else {
        await addConnection(user.uid, data.name.trim());
      }
      reset({ name: "" });
    } catch (error) {
      setError("name", { message: "Erro ao salvar conexão" });
    }
  }

  const handleCancel = () => {
    setEditingMode(false);
    reset({ name: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-3 mb-3 items-start"
    >
      <ControlledTextField
        name="name"
        control={control}
        rules={{ required: "Nome da conexão obrigatório" }}
        label="Nome da conexão"
        autoFocus
      />
      <Button type="submit" variant="contained" color="primary">
        {editingMode ? "Salvar" : "Adicionar"}
      </Button>
      {editingMode && (
        <Button variant="contained" color="error" onClick={handleCancel}>
          Cancelar
        </Button>
      )}
    </form>
  );
}
