'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PAGE_ACCESS, VIEW_ONLY_PAGES } from '@/config/permissions';
import type { Role } from '@/types/auth';

interface PermissionsContext {
  canAccess: (path: string) => boolean;
  isViewOnly: (path: string) => boolean;
  canPerformAction: (action: 'add' | 'edit' | 'delete') => boolean;
  isAdminOrPastor: () => boolean;
  hasRole: (role: Role) => boolean;
}

const PermissionsCtx = createContext<PermissionsContext>({
  canAccess: () => false,
  isViewOnly: () => false,
  canPerformAction: () => false,
  isAdminOrPastor: () => false,
  hasRole: () => false,
});

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();

  const canAccess = (path: string): boolean => {
    if (!role) return false;
    const allowed = PAGE_ACCESS[path];
    if (!allowed) return true;
    return allowed.includes(role);
  };

  const isViewOnly = (path: string): boolean => {
    if (!role) return true;
    const pages = VIEW_ONLY_PAGES[role];
    return pages?.includes(path) ?? false;
  };

  const canPerformAction = (action: 'add' | 'edit' | 'delete'): boolean => {
    if (!role) return false;
    if (role === 'Admin' || role === 'Pastor') return true;
    if (role === 'CA Leader') return action !== 'delete';
    return false;
  };

  const isAdminOrPastor = (): boolean => {
    return role === 'Admin' || role === 'Pastor';
  };

  const hasRole = (r: Role): boolean => role === r;

  return (
    <PermissionsCtx.Provider value={{ canAccess, isViewOnly, canPerformAction, isAdminOrPastor, hasRole }}>
      {children}
    </PermissionsCtx.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsCtx);
}
