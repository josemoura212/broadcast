import { Contact, getContacts } from "@/app/contact/contact.model";
import { useAuth } from "@/app/context/auth-context";
import { db } from "@/infra/services/firebase";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  addMessage,
  deleteMessage,
  Message,
  updateMessage,
} from "../message.model";
import { useSnapshot } from "@/app/hooks/firestore-hooks";
import { toDate } from "@/infra/utils/to-date";

export interface MessageController {
  selectedContacts: string[];
  setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  scheduledAt: Date | null;
  setScheduledAt: React.Dispatch<React.SetStateAction<Date | null>>;
  filter: "enviada" | "agendada" | "all";
  setFilter: React.Dispatch<
    React.SetStateAction<"enviada" | "agendada" | "all">
  >;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  editingMessage: {
    content: string;
    scheduledAt: Date | null;
    contactIds: string[];
  };
  setEditingMessage: React.Dispatch<
    React.SetStateAction<{
      content: string;
      scheduledAt: Date | null;
      contactIds: string[];
    }>
  >;
  confirmDeleteId: string | null;
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  editError: string;
  setEditError: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  loading: boolean;

  handleSend: (e: React.FormEvent) => Promise<void>;
  handleStartEdit: (msg: Message) => void;
  handleEditChange: (
    fields: Partial<{
      content: string;
      scheduledAt: Date | null;
      contactIds: string[];
    }>
  ) => void;
  handleSaveEdit: () => Promise<void>;
  handleCancelEdit: () => void;
  handleRemoveMessage: (id: string) => Promise<void>;
}

export function useMessagePage(): MessageController {
  const { user } = useAuth();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"enviada" | "agendada" | "all">("all");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{
    content: string;
    scheduledAt: Date | null;
    contactIds: string[];
  }>({
    content: "",
    scheduledAt: null,
    contactIds: [],
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string>("");

  useEffect(() => {
    if (user?.uid) {
      getContacts(user.uid).then(setContacts);
    }
  }, [user?.uid]);

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
        where("userId", "==", user?.uid)
      );
    }

    return query(
      messagesRef,
      orderBy("createdAt", "desc"),
      where("userId", "==", user?.uid)
    );
  }, [user?.uid, filter]);

  const { state: messages, loading } = useSnapshot<Message>(refMessages);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !content.trim() || selectedContacts.length === 0) return;

    await addMessage({
      userId: user.uid,
      content: content.trim(),
      contactIds: selectedContacts,
      scheduledAt: scheduledAt ?? undefined,
    });
    setContent("");
    setSelectedContacts([]);
    setScheduledAt(null);
  }

  function handleStartEdit(msg: Message) {
    setEditingId(msg.id);
    setEditingMessage({
      content: msg.content,
      scheduledAt: toDate(msg.scheduledAt) ?? null,
      contactIds: msg.contactIds ?? [],
    });
    setEditError("");
  }

  function handleEditChange(
    fields: Partial<{
      content: string;
      scheduledAt: Date | null;
      contactIds: string[];
    }>
  ) {
    setEditingMessage((prev) => ({ ...prev, ...fields }));
  }

  async function handleSaveEdit() {
    if (
      !user ||
      !editingId ||
      !editingMessage.content.trim() ||
      editingMessage.contactIds.length === 0
    )
      return;
    try {
      await updateMessage(editingId, {
        content: editingMessage.content.trim(),
        scheduledAt: editingMessage.scheduledAt ?? undefined,
        contactIds: editingMessage.contactIds,
      });
      setEditingId(null);
      setEditingMessage({ content: "", scheduledAt: null, contactIds: [] });
      setEditError("");
    } catch (e: any) {
      setEditError(e.message || "Erro ao editar mensagem");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingMessage({ content: "", scheduledAt: null, contactIds: [] });
    setEditError("");
  }

  async function handleRemoveMessage(id: string) {
    if (!user) return;
    await deleteMessage(id);
    setConfirmDeleteId(null);
  }

  const controller: MessageController = {
    selectedContacts,
    setSelectedContacts,
    content,
    setContent,
    scheduledAt,
    setScheduledAt,
    filter,
    setFilter,
    contacts,
    setContacts,
    editingId,
    setEditingId,
    editingMessage,
    setEditingMessage,
    confirmDeleteId,
    setConfirmDeleteId,
    editError,
    setEditError,
    messages,
    loading,
    handleSend,
    handleStartEdit,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleRemoveMessage,
  };

  return controller;
}
