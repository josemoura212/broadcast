import { useEffect, useState } from "react";
import { db } from "../../infra/services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Connection } from "../../domain/models/Connection";

export function useConnections(userId: string | undefined) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, `clients/${userId}/connections`),
      orderBy("name")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setConnections(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { name: string }),
        }))
      );
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  return { connections, loading };
}
