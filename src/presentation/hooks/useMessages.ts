import { useEffect, useState } from "react";
import { db } from "../../infra/services/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Message } from "../../domain/models/Message";
import { formatDateTimeLocal } from "../../infra/utils/formatDateTimeLocal";

export function useMessages(
  userId: string | undefined,
  status?: "agendada" | "enviada" | "all"
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const messagesRef = collection(db, `clients/${userId}/messages`);
    let q;

    if (status && status !== "all") {
      q = query(
        messagesRef,
        where("status", "==", status),
        orderBy("sentAt", "desc")
      );
    } else {
      q = query(messagesRef, orderBy("sentAt", "desc"));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            ...data,
            sentAt:
              data.sentAt && typeof data.sentAt.toDate === "function"
                ? formatDateTimeLocal(data.sentAt.toDate())
                : "",
            scheduledAt:
              data.scheduledAt && typeof data.scheduledAt.toDate === "function"
                ? formatDateTimeLocal(data.scheduledAt.toDate())
                : "",
          };
        })
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, status]);

  return { messages, loading };
}
