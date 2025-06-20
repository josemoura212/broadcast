import { Connection } from "../models/Connection";
export interface ConnectionRepository {
  getConnections(userId: string): Promise<Connection[]>;
  addConnection(
    userId: string,
    connection: Omit<Connection, "id">
  ): Promise<void>;
}
