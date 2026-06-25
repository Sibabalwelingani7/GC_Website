'use client';

import { usePathname } from 'next/navigation';
import { navigationItems } from '@/config/navigation';

export function Header() {
  const pathname = usePathname();
  const current = navigationItems.find((item) => item.href === pathname);
  const title = current?.label || 'Dashboard';

  return (
    <header className="hidden md:flex bg-slate-900 border-b border-slate-800 px-6 py-4 justify-between items-center shrink-0">
      <h2 className="text-base font-bold text-white tracking-wide">{title}</h2>
    </header>
  );
}
