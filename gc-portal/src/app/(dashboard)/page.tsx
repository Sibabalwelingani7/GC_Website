'use client';

import { Users, Banknote, CalendarCheck, Cake, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useDashboard } from '@/features/dashboard/use-dashboard';
import { StatCard } from '@/features/dashboard/components/stat-card';

function formatZAR(val: number) {
  return 'R' + val.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDob(dob: string) {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return dob;
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export default function DashboardPage() {
  const { staffData, role } = useAuth();
  const { totalMembers, totalOfferings, avgAttendance, birthdays, loading } = useDashboard();
  const firstName = staffData?.name?.split(' ')[0] || 'Staff';

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Welcome, {firstName}</h1>
        <span className="inline-block mt-2 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {role}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Members" value={totalMembers.toLocaleString()} icon={Users} color="text-indigo-400" />
        <StatCard label="Total Offerings (Year)" value={formatZAR(totalOfferings)} icon={Banknote} color="text-emerald-400" />
        <StatCard label="Average Attendance" value={avgAttendance.toLocaleString()} icon={CalendarCheck} color="text-sky-400" />
      </div>

      <div className="bg-slate-800 border border-slate-700/70 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Cake className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Birthdays This Month</h3>
        </div>
        {birthdays.length === 0 ? (
          <p className="text-xs text-slate-500">No birthdays this month.</p>
        ) : (
          <div className="space-y-2">
            {birthdays.map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/40">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden shrink-0">
                  {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" /> : (m.name || 'N').charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{m.name}</p>
                  <p className="text-[10px] text-slate-400">{formatDob(m.dob)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
