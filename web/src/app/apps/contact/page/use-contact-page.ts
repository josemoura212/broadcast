import { useAuth } from "@/app/context/auth-context";
import { useState } from "react";
import { Contact, deleteContact, useContact } from "../contact.model";
import { useConnectionCtx } from "@/app/context/connection-context";

export interface ContactController {
  confirmDeleteId: string | null;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  contacts: Contact[];
  loading: boolean;
  handleRemoveContact: (contactId: string) => Promise<void>;
}

export function useContactPage() {
  const { user } = useAuth();
  const { conn } = useConnectionCtx();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [contacts, loading] = useContact(user?.uid || "", conn?.id || "");

  async function handleRemoveContact(contactId: string) {
    if (!user) return;
    await deleteContact(contactId);
    setConfirmDeleteId(null);
  }

  const controller: ContactController = {
    confirmDeleteId,
    setConfirmDeleteId,
    contacts,
    loading,
    handleRemoveContact,
  };

  return controller;
}
