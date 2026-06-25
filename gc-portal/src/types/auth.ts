import type { User } from 'firebase/auth';

export type Role = 'Admin' | 'Pastor' | 'CA Leader';

export interface StaffData {
  name: string;
  email: string;
  role: string;
  photo?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  staffData: StaffData | null;
  staffDocId: string | null;
  role: Role | null;
  loading: boolean;
}
