'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import type { OfferingRecord } from './types';

export function useOfferings() {
  const [records, setRecords] = useState<OfferingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTIONS.OFFERINGS), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as OfferingRecord));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
  const avgAmount = records.length > 0 ? totalAmount / records.length : 0;

  return { records, loading, totalAmount, avgAmount };
}
