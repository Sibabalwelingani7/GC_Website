'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';
import type { AuthState, Role, StaffData } from '@/types/auth';

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  staffData: null,
  staffDocId: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

function normalizeRole(role: string | undefined): Role | null {
  if (!role) return null;
  const r = role.trim().toLowerCase();
  if (r === 'creative arts leader' || r === 'ca leader') return 'CA Leader';
  if (r === 'admin') return 'Admin';
  if (r === 'pastor') return 'Pastor';
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    staffData: null,
    staffDocId: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, staffData: null, staffDocId: null, role: null, loading: false });
        return;
      }

      try {
        const staffQuery = query(collection(db, 'staff'), where('email', '==', user.email));
        const snapshot = await getDocs(staffQuery);

        if (snapshot.empty) {
          await firebaseSignOut(auth);
          setState({ user: null, staffData: null, staffDocId: null, role: null, loading: false });
          return;
        }

        const doc = snapshot.docs[0];
        const staffData = doc.data() as StaffData;
        const role = normalizeRole(staffData.role);

        setState({ user, staffData, staffDocId: doc.id, role, loading: false });
      } catch {
        await firebaseSignOut(auth);
        setState({ user: null, staffData: null, staffDocId: null, role: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setState({ user: null, staffData: null, staffDocId: null, role: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
