import { ContactRepository } from "../repositories/ContactRepository";
export class GetContacts {
  constructor(private repo: ContactRepository) {}
  async execute(userId: string) {
    return this.repo.getContacts(userId);
  }
}
