'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import type { CalendarEvent } from './types';

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTIONS.EVENTS), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CalendarEvent));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { events, loading };
}
