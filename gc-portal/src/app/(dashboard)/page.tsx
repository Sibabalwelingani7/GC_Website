'use client';

import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { staffData, role } = useAuth();
  const firstName = staffData?.name?.split(' ')[0] || 'Staff';

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Welcome, {firstName}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {role}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-400">More dashboard widgets coming soon.</p>
    </div>
  );
}
