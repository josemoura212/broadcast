import Button from "@mui/material/Button";
import { useAuth } from "@/app/context/auth-context";
import { useEffect } from "react";
import { addContact, Contact, updateContact } from "../contact.model";
import { useConnectionCtx } from "@/app/context/connection-context";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "@/app/components/controlled-text-field";

interface ContactFormProps {
  contact?: Contact | null;
  editingMode: boolean;
  setEditingMode: (editing: boolean) => void;
}

interface ContactFormData {
  name: string;
  phone: string;
}

export function ContactForm(props: ContactFormProps) {
  const { contact, editingMode, setEditingMode } = props;

  const { conn } = useConnectionCtx();
  const { user } = useAuth();
  const { control, handleSubmit, reset } = useForm<ContactFormData>();

  useEffect(() => {
    if (!editingMode) {
      reset({ name: "", phone: "" });
      return;
    }
    reset({ name: contact?.name || "", phone: contact?.phone || "" });
  }, [editingMode]);

  async function onSubmit(data: ContactFormData) {
    if (!user || !data.name.trim() || !data.phone.trim() || !conn) {
      return;
    }

    if (editingMode) {
      if (!contact) return;
      await updateContact(contact.id, {
        name: data.name.trim(),
        phone: data.phone.trim(),
      });
      setEditingMode(false);
    } else {
      await addContact({
        connectionId: conn?.id,
        userId: user.uid,
        name: data.name.trim(),
        phone: data.phone.trim(),
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-3 mb-3 items-start flex-col"
    >
      <ControlledTextField<ContactFormData>
        name="name"
        control={control}
        rules={{ required: "Nome do contato é obrigatório" }}
        label="Nome do contato"
        autoFocus
      />
      <ControlledTextField<ContactFormData>
        name="phone"
        control={control}
        rules={{ required: "Telefone é obrigatório" }}
        label="Telefone"
        numbersOnly
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editingMode ? "Salvar" : "Adicionar"}
      </Button>
      {editingMode && (
        <Button
          type="button"
          variant="contained"
          color="error"
          fullWidth
          onClick={() => setEditingMode(false)}
        >
          Cancelar
        </Button>
      )}
    </form>
  );
}
