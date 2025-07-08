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
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../core/services/firebase";
import { Observable, shareReplay } from "rxjs";
import { snapToData } from "@/core/utils/firebase";
import { useObservable$ } from "../hooks/firestore-hooks";

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

export function useMessages(
  userId: string,
  connectionId: string,
  status?: "agendada" | "enviada"
) {
  return useObservable$<Message>(
    () =>
      getMessages$(userId, connectionId, status).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      ),
    [userId, connectionId, status]
  );
}

export function getMessages$(
  userId: string,
  connectionId: string,
  status?: "agendada" | "enviada"
) {
  return new Observable<Message[]>((subscriber) => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "messages"),
        where("userId", "==", userId),
        where("connectionId", "==", connectionId),
        ...(status ? [where("status", "==", status)] : []),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const data = snapshot.docs.map<Message>(snapToData);
        subscriber.next(data);
      }
    );
    return () => unsubscribe();
  });
}

export async function addMessage(params: {
  userId: string;
  connectionId: string;
  content: string;
  contactIds: string[];
  scheduledAt?: Date | null;
}): Promise<void> {
  const { userId, connectionId, content, contactIds, scheduledAt } = params;
  await addDoc(collection(db, "messages"), {
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
  const docRef = doc(collection(db, "messages"), messageId);

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
  const docRef = doc(collection(db, "messages"), messageId);
  await deleteDoc(docRef);
}

export async function sendMessageNow(messageId: string): Promise<void> {
  const docRef = doc(collection(db, "messages"), messageId);
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
