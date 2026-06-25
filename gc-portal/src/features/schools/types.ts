export interface School {
  id: string;
  name: string;
  address: string;
  photo: string;
  instType: string;
}

export type SchoolType = 'primary' | 'high' | 'uni';

export const SCHOOL_TYPE_LABELS: Record<SchoolType, { title: string; singular: string; addLabel: string }> = {
  primary: { title: 'Primary Schools', singular: 'Primary School', addLabel: 'Add School' },
  high: { title: 'High Schools', singular: 'High School', addLabel: 'Add School' },
  uni: { title: 'Universities & Colleges', singular: 'Institution', addLabel: 'Add Institution' },
};
