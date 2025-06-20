import { ContactRepository } from "../repositories/ContactRepository";
import { Contact } from "../models/Contact";

export class AddContact {
  constructor(private repo: ContactRepository) {}
  async execute(userId: string, contact: Omit<Contact, "id">) {
    return this.repo.addContact(userId, contact);
  }
}
