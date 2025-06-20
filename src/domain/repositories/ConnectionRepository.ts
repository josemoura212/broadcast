import { Connection } from "../models/Connection";
export interface ConnectionRepository {
  getConnections(userId: string): Promise<Connection[]>;
}
