import { Message } from "../models/Message";
export interface MessageRepository {
  getMessages(userId: string): Promise<Message[]>;
  addMessage(params: {
    userId: string;
    content: string;
    contactIds: string[];
    scheduledAt?: Date | null;
  }): Promise<void>;
}
