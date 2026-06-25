import type { Role } from '@/types/auth';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'System Users', href: '/users', icon: 'ShieldCheck', roles: ['Admin'] },
  { label: 'Members', href: '/members', icon: 'Users', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'Creative Arts', href: '/creative-arts', icon: 'Palette', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'Schools', href: '/schools', icon: 'GraduationCap', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'Maps', href: '/maps', icon: 'Map', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'Attendance', href: '/attendance', icon: 'CalendarCheck', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'Offerings', href: '/offerings', icon: 'Banknote', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'Transport', href: '/transport', icon: 'Bus', roles: ['Admin', 'Pastor', 'CA Leader'] },
  { label: 'Calendar', href: '/calendar', icon: 'Calendar', roles: ['Admin', 'Pastor', 'CA Leader'] },
];

export function getNavItemsForRole(role: Role | null): NavItem[] {
  if (!role) return [];
  return navigationItems.filter((item) => item.roles.includes(role));
}
