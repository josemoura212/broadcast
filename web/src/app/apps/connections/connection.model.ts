import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/core/services/firebase";
import { map, shareReplay } from "rxjs";
import { useObservable$ } from "@/app/hooks/use-observable";
import { collectionData } from "rxfire/firestore";

export interface Connection {
  id: string;
  userId: string;
  name: string;
}

const CONNECTIONS_COLLECTION = collection(db, "connections");

export function useConnections(userId: string) {
  return useObservable$(() => getConnections$(userId), [userId]);
}

export function getConnections$(userId: string) {
  return collectionData(
    query(
      CONNECTIONS_COLLECTION,
      where("userId", "==", userId),
      orderBy("name")
    ),
    { idField: "id" }
  ).pipe(
    shareReplay({ bufferSize: 1, refCount: false }),
    map((data) => data as Connection[])
  );
}

export async function addConnection(
  userId: string,
  connectionName: string
): Promise<void> {
  await addDoc(CONNECTIONS_COLLECTION, {
    userId,
    name: connectionName,
  });
}

export async function deleteConnection(connectionId: string): Promise<void> {
  const docref = doc(CONNECTIONS_COLLECTION, connectionId);
  await deleteDoc(docref);
}

export async function updateConnection(
  connectionId: string,
  connectionName: string
): Promise<void> {
  const docref = doc(CONNECTIONS_COLLECTION, connectionId);
  await updateDoc(docref, { name: connectionName });
}
