import { MessageRepository } from "../repositories/MessageRepository";
export class GetMessages {
  constructor(private repo: MessageRepository) {}
  async execute(userId: string) {
    return this.repo.getMessages(userId);
  }
}
