import { Contact, getContacts } from "@/app/contact/contact.model";
import { useAuth } from "@/app/context/auth-context";
import { db } from "@/core/services/firebase";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { deleteMessage, Message, sendMessageNow } from "../message.model";
import { useSnapshot } from "@/app/hooks/firestore-hooks";
import { useConnectionCtx } from "@/app/context/connection-context";

export interface MessageController {
  filter: "enviada" | "agendada" | "all";
  setFilter: React.Dispatch<
    React.SetStateAction<"enviada" | "agendada" | "all">
  >;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  confirmDeleteId: string | null;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  messages: Message[];
  loading: boolean;
  handleSendNow: (messageId: string) => Promise<void>;
  handleRemoveMessage: (id: string) => Promise<void>;
}

export function useMessagePage(): MessageController {
  const { user } = useAuth();
  const { conn } = useConnectionCtx();

  const [filter, setFilter] = useState<"enviada" | "agendada" | "all">("all");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid && conn?.id) {
      getContacts(user.uid, conn.id).then(setContacts);
    }
  }, [user?.uid, conn?.id]);

  const refMessages = useMemo(() => {
    const messagesRef = collection(
      db,
      "messages"
    ) as CollectionReference<Message>;

    if (filter !== "all") {
      return query(
        messagesRef,
        where("status", "==", filter),
        orderBy("createdAt", "desc"),
        where("userId", "==", user?.uid),
        where("connectionId", "==", conn?.id)
      );
    }

    return query(
      messagesRef,
      orderBy("createdAt", "desc"),
      where("userId", "==", user?.uid),
      where("connectionId", "==", conn?.id)
    );
  }, [user?.uid, filter, conn?.id]);

  const { state: messages, loading } = useSnapshot<Message>(refMessages);

  async function handleSendNow(messageId: string) {
    await sendMessageNow(messageId);
  }

  async function handleRemoveMessage(id: string) {
    if (!user) return;
    await deleteMessage(id);
    setConfirmDeleteId(null);
  }

  const controller: MessageController = {
    filter,
    setFilter,
    contacts,
    setContacts,
    confirmDeleteId,
    setConfirmDeleteId,
    messages,
    loading,
    handleSendNow,
    handleRemoveMessage,
  };

  return controller;
}
