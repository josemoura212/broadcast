import { ConnectionRepository } from "../repositories/ConnectionRepository";
export class GetConnections {
  constructor(private repo: ConnectionRepository) {}
  async execute(userId: string) {
    return this.repo.getConnections(userId);
  }
}
