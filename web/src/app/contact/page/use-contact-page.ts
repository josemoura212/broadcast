import { useAuth } from "@/app/context/auth-context";
import { db } from "@/infra/services/firebase";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useMemo, useState } from "react";
import {
  addContact,
  Contact,
  deleteContact,
  updateContact,
} from "../contact.model";
import { useSnapshot } from "@/app/hooks/firestore-hooks";

export interface ContactController {
  newContact: {
    name: string;
    phone: string;
  };
  setNewContact: React.Dispatch<
    React.SetStateAction<{ name: string; phone: string }>
  >;
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  editingContact: {
    name: string;
    phone: string;
  };
  setEditingContact: React.Dispatch<
    React.SetStateAction<{ name: string; phone: string }>
  >;
  confirmDeleteId: string | null;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  contacts: Contact[];
  loading: boolean;
  handleAddContact: (e: React.FormEvent) => Promise<void>;
  handleRemoveContact: (contactId: string) => Promise<void>;
  handleStartEdit: (id: string, name: string, phone: string) => void;
  handleSaveEdit: () => Promise<void>;
  handleCancelEdit: () => void;
}

export function useContactPage() {
  const { user } = useAuth();
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState({
    name: "",
    phone: "",
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const ref = useMemo(
    () =>
      query(
        collection(db, "contacts") as CollectionReference<Contact>,
        orderBy("name"),
        where("userId", "==", user?.uid)
      ),
    [user?.uid]
  );

  const { state: contacts, loading } = useSnapshot<Contact>(ref);

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newContact.name.trim() || !newContact.phone.trim()) {
      return;
    }
    await addContact({
      userId: user.uid,
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
    });
    setNewContact({ name: "", phone: "" });
  }

  async function handleStartEdit(id: string, name: string, phone: string) {
    setEditingId(id);
    setEditingContact({ name, phone });
  }

  async function handleSaveEdit() {
    if (
      !user ||
      !editingId ||
      !editingContact.name.trim() ||
      !editingContact.phone.trim()
    )
      return;
    await updateContact(editingId, {
      name: editingContact.name.trim(),
      phone: editingContact.phone.trim(),
    });
    setEditingId(null);
    setEditingContact({ name: "", phone: "" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingContact({ name: "", phone: "" });
  }

  async function handleRemoveContact(contactId: string) {
    if (!user) return;
    await deleteContact(contactId);
    setConfirmDeleteId(null);
  }

  const controller: ContactController = {
    newContact,
    setNewContact,
    editingId,
    setEditingId,
    editingContact,
    setEditingContact,
    confirmDeleteId,
    setConfirmDeleteId,
    contacts,
    loading,
    handleAddContact,
    handleRemoveContact,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
  };

  return { controller };
}
