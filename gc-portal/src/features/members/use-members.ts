'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, type QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import type { Member } from './types';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role, staffData } = useAuth();

  useEffect(() => {
    const constraints: QueryConstraint[] = [];

    // CA Leader sees only their department
    if (role === 'CA Leader' && staffData?.department) {
      constraints.push(where('dept', '==', staffData.department));
    }

    const q = query(collection(db, COLLECTIONS.MEMBERS), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
        setMembers(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError('Failed to load members.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [role, staffData?.department]);

  return { members, loading, error };
}
