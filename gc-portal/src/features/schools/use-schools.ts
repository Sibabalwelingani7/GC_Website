'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import type { School, SchoolType } from './types';
import type { Member } from '@/features/members/types';

export function useSchools(type: SchoolType) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.CAMPUSES), where('instType', '==', type));
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        setSchools(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as School)));
        setLoading(false);
      },
      () => { setError('Failed to load schools.'); setLoading(false); }
    );
    return () => unsubscribe();
  }, [type]);

  async function getMembersForSchool(schoolName: string): Promise<Member[]> {
    const q = query(collection(db, COLLECTIONS.MEMBERS), where('target', '==', schoolName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
  }

  return { schools, loading, error, getMembersForSchool };
}
