import { MessageRepository } from "../repositories/MessageRepository";

export class AddMessage {
  constructor(private repo: MessageRepository) {}
  async execute(params: {
    userId: string;
    content: string;
    contactIds: string[];
    scheduledAt?: Date | null;
  }) {
    return this.repo.addMessage(params);
  }
}
