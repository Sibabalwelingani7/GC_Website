'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';

interface BirthdayMember {
  name: string;
  dob: string;
  photo?: string;
}

interface DashboardState {
  totalMembers: number;
  totalOfferings: number;
  avgAttendance: number;
  birthdays: BirthdayMember[];
  loading: boolean;
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    totalMembers: 0, totalOfferings: 0, avgAttendance: 0, birthdays: [], loading: true,
  });

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const unsub1 = onSnapshot(collection(db, COLLECTIONS.MEMBERS), (snapshot) => {
      const members = snapshot.docs.map((doc) => doc.data());
      const birthdays = members
        .filter((m) => {
          if (!m.dob) return false;
          const d = new Date(m.dob);
          return !isNaN(d.getTime()) && d.getMonth() === currentMonth;
        })
        .map((m) => ({ name: m.name || 'Unnamed', dob: m.dob, photo: m.photo }));

      setState((prev) => ({ ...prev, totalMembers: snapshot.size, birthdays, loading: false }));
    });

    const unsub2 = onSnapshot(collection(db, COLLECTIONS.OFFERINGS), (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.date);
        if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
          total += parseFloat(data.amount) || 0;
        }
      });
      setState((prev) => ({ ...prev, totalOfferings: total }));
    });

    const unsub3 = onSnapshot(collection(db, COLLECTIONS.ATTENDANCE), (snapshot) => {
      if (snapshot.empty) { setState((prev) => ({ ...prev, avgAttendance: 0 })); return; }
      let sum = 0;
      snapshot.forEach((doc) => { sum += doc.data().count || 0; });
      setState((prev) => ({ ...prev, avgAttendance: Math.round(sum / snapshot.size) }));
    });

    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  return state;
}
