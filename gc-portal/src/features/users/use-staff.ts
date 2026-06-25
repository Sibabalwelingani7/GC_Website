'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import type { StaffUser } from './types';

export function useStaff() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.STAFF),
      (snapshot) => {
        setStaff(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StaffUser)));
        setLoading(false);
      },
      () => {
        setError('Failed to load staff users.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { staff, loading, error };
}
