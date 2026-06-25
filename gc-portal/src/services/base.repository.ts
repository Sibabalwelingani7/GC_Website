import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  type QueryConstraint,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

export class BaseRepository<T extends DocumentData> {
  constructor(private collectionName: string) {}

  protected get ref() {
    return collection(db, this.collectionName);
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<(T & { id: string })[]> {
    const q = query(this.ref, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  }

  async getById(id: string): Promise<(T & { id: string }) | null> {
    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    const docRef = await addDoc(this.ref, data);
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data as DocumentData);
  }

  async remove(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  subscribe(constraints: QueryConstraint[], callback: (data: (T & { id: string })[]) => void): Unsubscribe {
    const q = query(this.ref, ...constraints);
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
      callback(results);
    });
  }
}
