import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

export const processScheduledMessages = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    console.log("--- Início da execução da Cloud Function ---");
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    const scheduledMessagesSnap = await db
      .collectionGroup("messages")
      .where("status", "==", "agendada")
      .where("scheduledAt", "<=", now)
      .get();

    console.log(
      `[CF] Encontradas ${scheduledMessagesSnap.size} mensagens agendadas para atualizar.`
    );

    if (!scheduledMessagesSnap.empty) {
      const batch = db.batch();
      scheduledMessagesSnap.docs.forEach((msgDoc) => {
        batch.update(msgDoc.ref, {
          status: "enviada",
          sentAt: now,
        });
        console.log(`[CF] Atualizando mensagem ${msgDoc.id}`);
      });
      await batch.commit();
      console.log("[CF] Batch comitado com sucesso.");
    } else {
      console.log("[CF] Nenhuma mensagem agendada para atualizar.");
    }
    console.log("--- Fim da execução da Cloud Function ---");
    return null;
  });
