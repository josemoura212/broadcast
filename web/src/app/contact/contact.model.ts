import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../infra/services/firebase";

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export async function getContacts(userId: string): Promise<Contact[]> {
  const snapshot = await getDocs(collection(db, `clients/${userId}/contacts`));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Contact));
}

export async function addContact(
  userId: string,
  contact: Omit<Contact, "id">
): Promise<void> {
  await addDoc(collection(db, `clients/${userId}/contacts`), contact);
}

export async function deleteContact(
  userId: string,
  contactId: string
): Promise<void> {
  const docRef = doc(db, `clients/${userId}/contacts`, contactId);
  await deleteDoc(docRef);
}

export async function updateContact(
  userId: string,
  contactId: string,
  contact: Partial<Omit<Contact, "id">>
): Promise<void> {
  const docRef = doc(collection(db, `clients/${userId}/contacts`), contactId);
  await updateDoc(docRef, contact);
}
