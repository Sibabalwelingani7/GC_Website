'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, ChevronDown } from 'lucide-react';

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { staffData, role, user, signOut } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-1.5 text-[11px] text-white transition font-medium cursor-pointer"
      >
        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] uppercase font-bold text-white shrink-0 border border-indigo-400/30">
          {staffData?.name?.charAt(0) || 'U'}
        </div>
        <span className="hidden sm:inline">{staffData?.name?.split(' ')[0] || 'Profile'}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-lg bg-slate-800 border border-slate-700 shadow-xl py-1 text-[11px] z-50">
          <div className="px-3 py-2 border-b border-slate-700/60">
            <p className="text-slate-200 font-medium truncate">{staffData?.name || 'Staff'}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{user?.email}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {role}
            </span>
          </div>
          <button
            onClick={() => { setOpen(false); signOut(); }}
            className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
