import { QueryDocumentSnapshot } from "firebase/firestore";

export function snapToData<T>(snap: QueryDocumentSnapshot) {
  return { id: snap.id, ...snap.data() } as T;
}
