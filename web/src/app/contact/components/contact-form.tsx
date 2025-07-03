import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAuth } from "@/app/context/auth-context";
import { useEffect, useState } from "react";
import { addContact, Contact, updateContact } from "../contact.model";

interface ContactFormProps {
  contact?: Contact | null;
  editingMode: boolean;
  setEditingMode: (editing: boolean) => void;
}

export function ContactForm(props: ContactFormProps) {
  const { contact, editingMode, setEditingMode } = props;

  const { user } = useAuth();
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (editingMode && contact) {
      setNewContact({ name: contact.name, phone: contact.phone });
    }
    if (!editingMode) {
      setNewContact({ name: "", phone: "" });
    }
  }, [editingMode, contact]);

  async function handlerSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newContact.name.trim() || !newContact.phone.trim()) {
      return;
    }

    if (editingMode) {
      if (!contact) return;
      await updateContact(contact.id, {
        name: newContact.name.trim(),
        phone: newContact.phone.trim(),
      });
      setEditingMode(false);
      setNewContact({ name: "", phone: "" });
      return;
    }

    await addContact({
      userId: user.uid,
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
    });
    setNewContact({ name: "", phone: "" });
  }

  return (
    <form
      onSubmit={handlerSend}
      className="flex gap-3 mb-3 items-start flex-col"
    >
      <TextField
        label="Nome do contato"
        value={newContact.name}
        onChange={(e) => setNewContact((c) => ({ ...c, name: e.target.value }))}
        size="small"
        fullWidth
        required
      />
      <TextField
        label="Telefone"
        value={newContact.phone}
        onChange={(e) => {
          const onlyNumbers = e.target.value.replace(/\D/g, "");
          setNewContact((c) => ({ ...c, phone: onlyNumbers }));
        }}
        size="small"
        fullWidth
        required
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
