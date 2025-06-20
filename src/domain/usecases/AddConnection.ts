import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { Connection } from "../models/Connection";

export class AddConnection {
  constructor(private repo: ConnectionRepository) {}
  async execute(userId: string, connection: Omit<Connection, "id">) {
    return this.repo.addConnection(userId, connection);
  }
}
