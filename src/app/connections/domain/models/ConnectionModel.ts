import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../infra/services/firebase";

export interface Connection {
  id: string;
  name: string;
}

export async function getConnections(userId: string): Promise<Connection[]> {
  const snapshot = await getDocs(
    collection(db, `clients/${userId}/connections`)
  );
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Connection)
  );
}

export async function addConnection(
  userId: string,
  connectionName: string
): Promise<void> {
  await addDoc(collection(db, `clients/${userId}/connections`), {
    name: connectionName,
  });
}

export async function deleteConnection(
  userId: string,
  connectionId: string
): Promise<void> {
  const docref = doc(
    collection(db, `clients/${userId}/connections`),
    connectionId
  );
  await deleteDoc(docref);
}

export async function updateConnection(
  userId: string,
  connectionId: string,
  connectionName: string
): Promise<void> {
  const docref = doc(
    collection(db, `clients/${userId}/connections`),
    connectionId
  );
  await updateDoc(docref, { name: connectionName });
}
