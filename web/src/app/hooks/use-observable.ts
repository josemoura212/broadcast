import { useEffect, useState } from "react";
import { Observable } from "rxjs/internal/Observable";

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
