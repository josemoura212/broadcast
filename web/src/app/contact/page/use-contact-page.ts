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
import { Contact, deleteContact } from "../contact.model";
import { useSnapshot } from "@/app/hooks/firestore-hooks";

export interface ContactController {
  confirmDeleteId: string | null;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  contacts: Contact[];
  loading: boolean;
  handleRemoveContact: (contactId: string) => Promise<void>;
}

export function useContactPage() {
  const { user } = useAuth();

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
