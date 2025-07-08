import {
  CollectionReference,
  Query,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Observable } from "rxjs/internal/Observable";

export function useSnapshot<T extends { id: string }>(
  ref: CollectionReference<T> | Query<T | DocumentData, DocumentData>
) {
  const [state, setState] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

export function useObservable$<T>(
  observableFn: () => Observable<T[]>,
  deps: any[]
): [T[], boolean] {
  const [state, setState] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = observableFn().subscribe((list) => {
      setState(list);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, deps);

  return [state, loading];
}
