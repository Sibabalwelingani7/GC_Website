'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { getNavItemsForRole } from '@/config/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { role, staffData, signOut } = useAuth();
  const items = getNavItemsForRole(role);

  return (
    <aside className="hidden md:flex w-64 flex-col bg-slate-950 border-r border-slate-800 h-screen shrink-0">
      <div className="p-4 border-b border-slate-800">
        <h1 className="text-sm font-bold tracking-wide uppercase text-indigo-300">
          The Glorious Church
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = Icons[item.icon as keyof typeof Icons] as Icons.LucideIcon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
            {staffData?.name?.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <p className="font-medium text-slate-200 truncate">{staffData?.name || 'Staff'}</p>
            <p className="text-[10px] text-indigo-400 uppercase tracking-wider">{role || 'Staff'}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition text-xs cursor-pointer"
        >
          <Icons.LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
