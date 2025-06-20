import { ConnectionRepository } from "../../domain/repositories/ConnectionRepository";
import { Connection } from "../../domain/models/Connection";
import { db } from "../../infra/services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export class FirebaseConnectionRepository implements ConnectionRepository {
  async getConnections(userId: string): Promise<Connection[]> {
    const snapshot = await getDocs(
      collection(db, `clients/${userId}/connections`)
    );
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Connection)
    );
  }

  async addConnection(
    userId: string,
    connection: Omit<Connection, "id">
  ): Promise<void> {
    await addDoc(collection(db, `clients/${userId}/connections`), connection);
  }
}
