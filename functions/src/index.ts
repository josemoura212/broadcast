import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

export const processScheduledMessages = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    const clientsSnap = await db.collection("clients").get();

    for (const clientDoc of clientsSnap.docs) {
      const messagesRef = clientDoc.ref.collection("messages");
      const scheduledSnap = await messagesRef
        .where("status", "==", "agendada")
        .where("scheduledAt", "<=", now)
        .get();

      const batch = db.batch();
      scheduledSnap.docs.forEach((msgDoc) => {
        batch.update(msgDoc.ref, {
          status: "enviada",
          sentAt: now,
        });
      });
      if (!scheduledSnap.empty) {
        await batch.commit();
        console.log(`Client ${clientDoc.id} - Batch committed`);
      }
    }
    return null;
  });
