import * as functions from "firebase-functions/v1";
import { db, timestamp } from "./firebase-config";

export const processScheduledMessages = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const now = timestamp.now();

    const scheduledMessagesSnap = await db
      .collectionGroup("messages")
      .where("status", "==", "agendada")
      .where("scheduledAt", "<=", now)
      .get();

    if (!scheduledMessagesSnap.empty) {
      for (const msgDoc of scheduledMessagesSnap.docs) {
        await msgDoc.ref.update({
          status: "enviada",
          sentAt: now,
        });
      }
    }
    return null;
  });
