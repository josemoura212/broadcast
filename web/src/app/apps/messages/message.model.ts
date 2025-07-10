import {
  addDoc,
  collection,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/core/services/firebase";
import { map, shareReplay } from "rxjs";
import { useObservable$ } from "../../hooks/use-observable";
import { collectionData } from "rxfire/firestore";

export interface Message {
  id: string;
  userId: string;
  connectionId: string;
  content: string;
  status: "agendada" | "enviada";
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt?: Date;
  contactIds: string[];
}

const MESSAGES_COLLECTION = collection(db, "messages");

export function useMessages(
  userId: string,
  connectionId: string,
  status?: "agendada" | "enviada"
) {
  return useObservable$(
    () => getMessages$(userId, connectionId, status),
    [userId, connectionId, status]
  );
}

export function getMessages$(
  userId: string,
  connectionId: string,
  status?: "agendada" | "enviada"
) {
  return collectionData(
    query(
      MESSAGES_COLLECTION,
      where("userId", "==", userId),
      where("connectionId", "==", connectionId),
      ...(status ? [where("status", "==", status)] : []),
      orderBy("createdAt", "desc")
    ),
    { idField: "id" }
  ).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: false,
    }),
    map((data) => data as Message[])
  );
}

export async function addMessage(params: {
  userId: string;
  connectionId: string;
  content: string;
  contactIds: string[];
  scheduledAt?: Date | null;
}): Promise<void> {
  const { userId, connectionId, content, contactIds, scheduledAt } = params;
  await addDoc(MESSAGES_COLLECTION, {
    content,
    userId,
    connectionId,
    status: scheduledAt ? "agendada" : "enviada",
    scheduledAt: scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    sentAt: scheduledAt ? null : Timestamp.now(),
    createdAt: Timestamp.now(),
    contactIds,
  });
}

export async function updateMessage(
  messageId: string,
  updates: {
    content: string;
    scheduledAt?: Date | null;
    contactIds: string[];
    status?: "agendada" | "enviada";
    sentAt?: Date;
  }
): Promise<void> {
  const docRef = doc(MESSAGES_COLLECTION, messageId);

  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    throw new Error("Mensagem não encontrada");
  }

  const data = snap.data();
  if (data.status !== "agendada") {
    throw new Error("Só é possível editar mensagens agendadas");
  }

  const updateData: any = { ...updates };

  if (updates.scheduledAt !== undefined) {
    updateData.scheduledAt = updates.scheduledAt
      ? Timestamp.fromDate(updates.scheduledAt)
      : null;
  }
  await updateDoc(docRef, updateData);
}

export async function deleteMessage(messageId: string): Promise<void> {
  const docRef = doc(MESSAGES_COLLECTION, messageId);
  await deleteDoc(docRef);
}

export async function sendMessageNow(messageId: string): Promise<void> {
  const docRef = doc(MESSAGES_COLLECTION, messageId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    throw new Error("Mensagem não encontrada");
  }

  const data = snap.data();
  if (data.status !== "agendada") {
    throw new Error("Só é possível enviar mensagens agendadas");
  }

  await updateDoc(docRef, {
    status: "enviada",
    sentAt: Timestamp.now(),
    scheduledAt: null,
  });
}
