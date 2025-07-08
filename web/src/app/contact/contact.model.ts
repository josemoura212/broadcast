import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/core/services/firebase";
import { useObservable$ } from "../hooks/firestore-hooks";
import { Observable, shareReplay } from "rxjs";
import { snapToData } from "@/core/utils/firebase";

export interface Contact {
  id: string;
  connectionId: string;
  userId: string;
  name: string;
  phone: string;
}

export function useContact(userId: string, connectionId: string) {
  return useObservable$(
    () =>
      getContacts$(userId, connectionId).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      ),
    [userId, connectionId]
  );
}

export function getContacts$(userId: string, connectionId: string) {
  return new Observable<Contact[]>((subscriber) => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "contacts"),
        where("userId", "==", userId),
        where("connectionId", "==", connectionId),
        orderBy("name")
      ),
      (snapshot) => {
        const data = snapshot.docs.map<Contact>(snapToData);
        subscriber.next(data);
      }
    );
    return () => unsubscribe();
  });
}

export async function addContact(contact: {
  userId: string;
  connectionId: string;
  name: string;
  phone: string;
}): Promise<void> {
  await addDoc(collection(db, "contacts"), contact);
}

export async function deleteContact(contactId: string): Promise<void> {
  const docRef = doc(db, "contacts", contactId);
  await deleteDoc(docRef);
}

export async function updateContact(
  contactId: string,
  contact: {
    name: string;
    phone: string;
  }
): Promise<void> {
  const docRef = doc(collection(db, "contacts"), contactId);
  await updateDoc(docRef, contact);
}
