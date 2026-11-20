import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, onSnapshot,
} from 'firebase/firestore';

const CACHE_KEY = (uid) => `finapp_items_${uid}`;

export function useFinance(user) {
  const [allItems, setAllItems] = useState(() => {
    // Carrega do cache local instantaneamente
    if (!user) return [];
    try {
      const raw = localStorage.getItem(CACHE_KEY(user.uid));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    if (!user) { setAllItems([]); return; }

    const q = query(collection(db, `users/${user.uid}/items`));

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAllItems(items);
      setSyncing(false);
      // Persiste no cache local
      try {
        localStorage.setItem(CACHE_KEY(user.uid), JSON.stringify(items));
      } catch { /* quota excedida - ignora */ }
    });

    return unsub;
  }, [user]);

  const addItem = useCallback(async (data) => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/items`), {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }, [user]);

  const updateItem = useCallback(async (id, data) => {
    if (!user) return;
    await updateDoc(doc(db, `users/${user.uid}/items`, id), data);
  }, [user]);

  const deleteItem = useCallback(async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/items`, id));
  }, [user]);

  return { allItems, syncing, addItem, updateItem, deleteItem };
}
