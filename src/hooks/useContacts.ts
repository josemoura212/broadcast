import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Contact } from "../types";

export function useContacts(userId: string | undefined) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, `clients/${userId}/contacts`),
      orderBy("name")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setContacts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { name: string; phone: string }),
        }))
      );
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  return { contacts, loading };
}
