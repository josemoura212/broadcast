import { Contact } from "../models/Contact";
export interface ContactRepository {
  getContacts(userId: string): Promise<Contact[]>;
  addContact(userId: string, contact: Omit<Contact, "id">): Promise<void>;
}
