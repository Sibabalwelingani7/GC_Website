'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/constants';
import { creativeArtsService } from './creative-arts.service';
import type { CreativeGroup } from './types';
import type { Member } from '@/features/members/types';

export function useCreativeArts() {
  const [groups, setGroups] = useState<CreativeGroup[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    const unsub1 = onSnapshot(
      collection(db, COLLECTIONS.CREATIVE_ARTS),
      (snapshot) => {
        if (snapshot.empty && !seeded.current) {
          seeded.current = true;
          creativeArtsService.seed();
          return;
        }
        setGroups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CreativeGroup)));
        setLoading(false);
      },
      () => { setError('Failed to load creative arts.'); setLoading(false); }
    );

    const unsub2 = onSnapshot(collection(db, COLLECTIONS.MEMBERS), (snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member)));
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  function getMemberCount(groupName: string): number {
    const key = (groupName || '').trim().toLowerCase();
    return members.filter((m) => {
      const dept = (m.dept || '').trim().toLowerCase();
      return dept === key || dept.includes(key) || key.includes(dept);
    }).length;
  }

  function getMembersForGroup(groupName: string): Member[] {
    const key = (groupName || '').trim().toLowerCase();
    return members.filter((m) => {
      const dept = (m.dept || '').trim().toLowerCase();
      return dept === key || dept.includes(key) || key.includes(dept);
    });
  }

  return { groups, members, loading, error, getMemberCount, getMembersForGroup };
}
