'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';

export interface Campus {
  name: string;
  instType: string;
}

export function useCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTIONS.CAMPUSES), (snapshot) => {
      setCampuses(snapshot.docs.map((doc) => doc.data() as Campus));
    });
    return () => unsubscribe();
  }, []);

  function getCampusesByType(type: string) {
    return campuses.filter((c) => c.instType === type);
  }

  return { campuses, getCampusesByType };
}
