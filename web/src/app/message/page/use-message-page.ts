import { Contact, useContact } from "@/app/contact/contact.model";
import { useAuth } from "@/app/context/auth-context";
import { useState } from "react";
import {
  deleteMessage,
  Message,
  sendMessageNow,
  useMessages,
} from "../message.model";
import { useConnectionCtx } from "@/app/context/connection-context";

export interface MessageController {
  filter: "enviada" | "agendada" | "all";
  setFilter: React.Dispatch<
    React.SetStateAction<"enviada" | "agendada" | "all">
  >;
  contacts: Contact[];
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [contacts] = useContact(user?.uid || "", conn?.id || "");
  const [messages, loading] = useMessages(
    user?.uid || "",
    conn?.id || "",
    filter !== "all" ? filter : undefined
  );

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
    confirmDeleteId,
    setConfirmDeleteId,
    messages,
    loading,
    handleSendNow,
    handleRemoveMessage,
  };

  return controller;
}
