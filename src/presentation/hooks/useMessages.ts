import { useEffect, useState } from "react";
import { Message } from "../../domain/models/Message";
import { FirebaseMessageRepository } from "../../data/repositories/FirebaseMessageRepository";
import { GetMessages } from "../../domain/usecases/GetMessages";

export function useMessages(
  userId: string | undefined,
  status?: "agendada" | "enviada" | "all"
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const repo = new FirebaseMessageRepository();
    const usecase = new GetMessages(repo);
    usecase.execute(userId).then((msgs) => {
      let filtered = msgs;
      if (status && status !== "all") {
        filtered = msgs.filter((m) => m.status === status);
      }
      setMessages(
        filtered.map((msg) => ({
          ...msg,
          sentAt: msg.sentAt ? new Date(msg.sentAt) : undefined,
          scheduledAt: msg.scheduledAt ? new Date(msg.scheduledAt) : undefined,
        }))
      );
      setLoading(false);
    });
  }, [userId, status]);

  return { messages, loading };
}
