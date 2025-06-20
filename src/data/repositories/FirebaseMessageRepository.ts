import { MessageRepository } from "../../domain/repositories/MessageRepository";
import { Message } from "../../domain/models/Message";
import { db } from "../../infra/services/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

export class FirebaseMessageRepository implements MessageRepository {
  async getMessages(userId: string): Promise<Message[]> {
    const snapshot = await getDocs(
      collection(db, `clients/${userId}/messages`)
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
      } as Message;
    });
  }

  async addMessage(params: {
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
}
