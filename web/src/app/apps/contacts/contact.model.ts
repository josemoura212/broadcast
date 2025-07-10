import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/core/services/firebase";
import { useObservable$ } from "@/app/hooks/use-observable";
import { map, shareReplay } from "rxjs";
import { collectionData } from "rxfire/firestore";

export interface Contact {
  id: string;
  connectionId: string;
  userId: string;
  name: string;
  phone: string;
}

const CONTACTS_COLLECTION = collection(db, "contacts");

export function useContacts(userId: string, connectionId: string) {
  return useObservable$(
    () => getContacts$(userId, connectionId),
    [userId, connectionId]
  );
}

export function getContacts$(userId: string, connectionId: string) {
  return collectionData(
    query(
      CONTACTS_COLLECTION,
      where("userId", "==", userId),
      where("connectionId", "==", connectionId),
      orderBy("name")
    ),
    { idField: "id" }
  ).pipe(
    shareReplay({ bufferSize: 1, refCount: false }),
    map((data) => data as Contact[])
  );
}

export async function addContact(contact: {
  userId: string;
  connectionId: string;
  name: string;
  phone: string;
}): Promise<void> {
  await addDoc(CONTACTS_COLLECTION, contact);
}

export async function deleteContact(contactId: string): Promise<void> {
  const docRef = doc(CONTACTS_COLLECTION, contactId);
  await deleteDoc(docRef);
}

export async function updateContact(
  contactId: string,
  contact: {
    name: string;
    phone: string;
  }
): Promise<void> {
  const docRef = doc(CONTACTS_COLLECTION, contactId);
  await updateDoc(docRef, contact);
}
