'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import type { AttendanceRecord } from './types';

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTIONS.ATTENDANCE), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const peakCount = records.reduce((max, r) => Math.max(max, r.count), 0);
  const avgCount = records.length > 0 ? Math.round(records.reduce((sum, r) => sum + r.count, 0) / records.length) : 0;

  return { records, loading, peakCount, avgCount };
}
