import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../infra/services/firebase";

export interface Connection {
  id: string;
  name: string;
}

export async function getConnections(userId: string): Promise<Connection[]> {
  const snapshot = await getDocs(
    query(collection(db, `connections`), where("userId", "==", userId))
  );
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Connection)
  );
}

export async function addConnection(
  userId: string,
  connectionName: string
): Promise<void> {
  await addDoc(collection(db, "connections"), {
    userId,
    name: connectionName,
  });
}

export async function deleteConnection(connectionId: string): Promise<void> {
  const docref = doc(collection(db, "connections"), connectionId);
  await deleteDoc(docref);
}

export async function updateConnection(
  connectionId: string,
  connectionName: string
): Promise<void> {
  const docref = doc(collection(db, "connections"), connectionId);
  await updateDoc(docref, { name: connectionName });
}
