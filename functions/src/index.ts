import * as functions from "firebase-functions/v1";
import { db, timestamp } from "./firebase-config";

export const processScheduledMessages = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (_) => {
    const now = timestamp.now();

    const scheduledMessagesSnap = await db
      .collectionGroup("messages")
      .where("status", "==", "agendada")
      .where("scheduledAt", "<=", now)
      .get();

    if (scheduledMessagesSnap.empty === true) return;

    const results = await Promise.allSettled(
      scheduledMessagesSnap.docs.map(
        async (doc) =>
          await doc.ref.update({
            status: "enviada",
            sentAt: now,
          })
      )
    );

    results.forEach((result, index) => {
      if (result.status !== "fulfilled") {
        console.error(
          `Erro ao atualizar mensagem ${scheduledMessagesSnap.docs[index].id}:`,
          result.reason
        );
      }
    });
  });
