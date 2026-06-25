import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700/70 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <h3 className={`text-xl font-bold mt-2 ${color}`}>{value}</h3>
    </div>
  );
}
