import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../infra/services/firebase";
import { Contact } from "../../domain/models/Contact";

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
