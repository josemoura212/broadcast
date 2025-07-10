import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export default function useBehavior<T>(observable: BehaviorSubject<T>): T {
  const [state, setState] = useState(observable.value);

  useEffect(() => {
    const subscription = observable.subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
