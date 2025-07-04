import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../infra/services/firebase";

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

export async function getMessages(
  userId: string,
  connectionId: string
): Promise<Message[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "messages"),
      where("userId", "==", userId),
      where("connectionId", "==", connectionId)
    )
  );
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      sentAt:
        data.sentAt && typeof data.sentAt.toDate === "function"
          ? data.sentAt.toDate()
          : undefined,
      scheduledAt:
        data.scheduledAt && typeof data.scheduledAt.toDate === "function"
          ? data.scheduledAt.toDate()
          : undefined,
      createdAt:
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate()
          : undefined,
    } as Message;
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
