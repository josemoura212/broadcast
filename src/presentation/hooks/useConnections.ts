import { useEffect, useState, useCallback } from "react";
import { Connection } from "../../domain/models/Connection";
import { FirebaseConnectionRepository } from "../../data/repositories/FirebaseConnectionRepository";
import { GetConnections } from "../../domain/usecases/GetConnections";

export function useConnections(userId: string | undefined) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const refetch = useCallback(() => setReload((r) => r + 1), []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const repo = new FirebaseConnectionRepository();
    const usecase = new GetConnections(repo);
    usecase.execute(userId).then((conns) => {
      setConnections(conns);
      setLoading(false);
    });
  }, [userId, reload]);

  return { connections, loading, refetch };
}
