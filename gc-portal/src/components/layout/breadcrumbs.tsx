'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { navigationItems } from '@/config/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  const current = navigationItems.find((item) => item.href === pathname);

  if (pathname === '/') return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
      <Link href="/" className="hover:text-white transition">Dashboard</Link>
      {current && (
        <>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-200 font-medium">{current.label}</span>
        </>
      )}
    </nav>
  );
}
