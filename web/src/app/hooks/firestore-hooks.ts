import {
  CollectionReference,
  Query,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useSnapshot<T extends { id: string }>(
  ref: CollectionReference<T> | Query<T | DocumentData, DocumentData>
) {
  const [state, setState] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as T)
      );
      setState(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [ref]);

  return { state, loading };
}
