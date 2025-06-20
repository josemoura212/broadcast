import { ContactRepository } from "../../domain/repositories/ContactRepository";
import { Contact } from "../../domain/models/Contact";
import { db } from "../../infra/services/firebase";
import { collection, getDocs } from "firebase/firestore";

export class FirebaseContactRepository implements ContactRepository {
  async getContacts(userId: string): Promise<Contact[]> {
    const snapshot = await getDocs(
      collection(db, `clients/${userId}/contacts`)
    );
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Contact)
    );
  }
}
