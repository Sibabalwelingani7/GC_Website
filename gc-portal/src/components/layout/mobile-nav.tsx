'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { getNavItemsForRole } from '@/config/navigation';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { role, staffData, signOut } = useAuth();
  const items = getNavItemsForRole(role);

  return (
    <>
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xs font-bold tracking-wide uppercase text-indigo-300">
          The Glorious Church
        </h1>
        <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white cursor-pointer">
          <Icons.Menu className="w-6 h-6" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h1 className="text-sm font-bold tracking-wide uppercase text-indigo-300">
                The Glorious Church
              </h1>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {items.map((item) => {
                const Icon = Icons[item.icon as keyof typeof Icons] as Icons.LucideIcon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition',
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 text-xs">
              <p className="font-medium text-slate-200 truncate">{staffData?.name || 'Staff'}</p>
              <button
                onClick={signOut}
                className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              >
                <Icons.LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
