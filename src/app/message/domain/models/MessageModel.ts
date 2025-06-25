import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../../infra/services/firebase";

export interface Message {
  id: string;
  content: string;
  status: "agendada" | "enviada";
  scheduledAt?: Date;
  sentAt?: Date;
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
    contactIds,
  });
}
