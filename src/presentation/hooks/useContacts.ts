import { useEffect, useState } from "react";
import { Contact } from "../../domain/models/Contact";
import { FirebaseContactRepository } from "../../data/repositories/FirebaseContactRepository";
import { GetContacts } from "../../domain/usecases/GetContacts";

export function useContacts(userId: string | undefined) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const repo = new FirebaseContactRepository();
    const usecase = new GetContacts(repo);
    usecase.execute(userId).then((cts) => {
      setContacts(cts);
      setLoading(false);
    });
  }, [userId]);

  return { contacts, loading };
}
