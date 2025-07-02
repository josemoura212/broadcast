import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../infra/services/firebase";

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone: string;
}

export async function getContacts(userId: string): Promise<Contact[]> {
  const snapshot = await getDocs(
    query(collection(db, "contacts"), where("userId", "==", userId))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Contact));
}

export async function addContact(contact: Omit<Contact, "id">): Promise<void> {
  await addDoc(collection(db, "contacts"), contact);
}

export async function deleteContact(contactId: string): Promise<void> {
  const docRef = doc(db, "contacts", contactId);
  await deleteDoc(docRef);
}

export async function updateContact(
  contactId: string,
  contact: Partial<Omit<Contact, "id">>
): Promise<void> {
  const docRef = doc(collection(db, "contacts"), contactId);
  await updateDoc(docRef, contact);
}
