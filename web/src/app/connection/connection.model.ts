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
import { db } from "../../core/services/firebase";
import { Observable, shareReplay } from "rxjs";
import { useObservable$ } from "../hooks/firestore-hooks";
import { collectionData } from "rxfire/firestore";

export interface Connection {
  id: string;
  userId: string;
  name: string;
}

export function useConnections(userId: string) {
  return useObservable$(
    () =>
      getConnections$(userId).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      ),
    [userId]
  );
}

export function getConnections$(userId: string) {
  return new Observable<Connection[]>((subscriber) => {
    collectionData(
      query(
        collection(db, "connections"),
        where("userId", "==", userId),
        orderBy("name")
      ),
      { idField: "id" }
    ).subscribe((data) => subscriber.next(data as Connection[]));
  });
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
