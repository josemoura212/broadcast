import { Contact } from "../models/Contact";
export interface ContactRepository {
  getContacts(userId: string): Promise<Contact[]>;
}
