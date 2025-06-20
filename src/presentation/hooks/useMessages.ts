import { useEffect, useState, useCallback } from "react";
import { Message } from "../../domain/models/Message";
import { FirebaseMessageRepository } from "../../data/repositories/FirebaseMessageRepository";
import { GetMessages } from "../../domain/usecases/GetMessages";

export function useMessages(
  userId: string | undefined,
  status?: "agendada" | "enviada" | "all"
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const refetch = useCallback(() => setReload((r) => r + 1), []);

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
          sentAt:
            msg.sentAt instanceof Date
              ? msg.sentAt
              : msg.sentAt
              ? new Date(msg.sentAt)
              : undefined,
          scheduledAt:
            msg.scheduledAt instanceof Date
              ? msg.scheduledAt
              : msg.scheduledAt
              ? new Date(msg.scheduledAt)
              : undefined,
        }))
      );
      setLoading(false);
    });
  }, [userId, status, reload]);

  return { messages, loading, refetch };
}
