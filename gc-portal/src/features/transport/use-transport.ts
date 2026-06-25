'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import type { Driver } from './types';

export function useTransport() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTIONS.TRANSPORT), (snapshot) => {
      setDrivers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Driver)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { drivers, loading };
}
