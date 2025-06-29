import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../../infra/services/firebase";

export interface Message {
  id: string;
  content: string;
  status: "agendada" | "enviada";
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt?: Date;
  contactIds: string[];
}

export async function getMessages(userId: string): Promise<Message[]> {
  const snapshot = await getDocs(collection(db, `clients/${userId}/messages`));
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
  content: string;
  contactIds: string[];
  scheduledAt?: Date | null;
}): Promise<void> {
  const { userId, content, contactIds, scheduledAt } = params;
  await addDoc(collection(db, `clients/${userId}/messages`), {
    content,
    status: scheduledAt ? "agendada" : "enviada",
    scheduledAt: scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    sentAt: scheduledAt ? null : Timestamp.now(),
    createdAt: Timestamp.now(),
    contactIds,
  });
}

export async function updateMessage(
  userId: string,
  messageId: string,
  updates: Partial<Pick<Message, "content" | "scheduledAt" | "contactIds">>
): Promise<void> {
  const docRef = doc(collection(db, `clients/${userId}/messages`), messageId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Mensagem não encontrada");
  const data = snap.data();
  if (data.status !== "agendada")
    throw new Error("Só é possível editar mensagens agendadas");
  const updateData: any = { ...updates };
  if (updates.scheduledAt !== undefined) {
    updateData.scheduledAt = updates.scheduledAt
      ? Timestamp.fromDate(updates.scheduledAt)
      : null;
  }
  await updateDoc(docRef, updateData);
}

export async function deleteMessage(
  userId: string,
  messageId: string
): Promise<void> {
  const docRef = doc(collection(db, `clients/${userId}/messages`), messageId);
  await deleteDoc(docRef);
}
