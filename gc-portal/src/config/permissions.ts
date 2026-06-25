import type { Role } from '@/types/auth';

export const PAGE_ACCESS: Record<string, Role[]> = {
  '/': ['Admin', 'Pastor', 'CA Leader'],
  '/users': ['Admin'],
  '/members': ['Admin', 'Pastor', 'CA Leader'],
  '/creative-arts': ['Admin', 'Pastor', 'CA Leader'],
  '/schools': ['Admin', 'Pastor', 'CA Leader'],
  '/maps': ['Admin', 'Pastor', 'CA Leader'],
  '/attendance': ['Admin', 'Pastor', 'CA Leader'],
  '/offerings': ['Admin', 'Pastor', 'CA Leader'],
  '/transport': ['Admin', 'Pastor', 'CA Leader'],
  '/calendar': ['Admin', 'Pastor', 'CA Leader'],
};

export const VIEW_ONLY_PAGES: Partial<Record<Role, string[]>> = {
  'CA Leader': ['/attendance'],
};
