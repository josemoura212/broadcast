import { useEffect, useState, useCallback, useRef } from "react";
import { Contact } from "../../domain/models/Contact";
import { FirebaseContactRepository } from "../../data/repositories/FirebaseContactRepository";
import { GetContacts } from "../../domain/usecases/GetContacts";

export function useContacts(userId: string | undefined) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const isFirstLoad = useRef(true);

  const refetch = useCallback(() => setReload((r) => r + 1), []);

  useEffect(() => {
    if (!userId) return;
    if (isFirstLoad.current) {
      setLoading(true);
    }
    const repo = new FirebaseContactRepository();
    const usecase = new GetContacts(repo);
    usecase.execute(userId).then((cts) => {
      setContacts(cts);
      setLoading(false);
      isFirstLoad.current = false;
    });
  }, [userId, reload]);

  return { contacts, loading, refetch };
}
