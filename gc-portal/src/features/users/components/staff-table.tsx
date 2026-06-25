'use client';

import { Edit3, Trash2 } from 'lucide-react';
import type { StaffUser } from '../types';

interface StaffTableProps {
  staff: StaffUser[];
  onEdit: (user: StaffUser) => void;
  onDelete: (user: StaffUser) => void;
}

export function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700/60 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-400">
            <th className="py-2.5 px-4 w-[50px]">Avatar</th>
            <th className="py-2.5 px-4">Name</th>
            <th className="py-2.5 px-4">Email</th>
            <th className="py-2.5 px-4">Role</th>
            <th className="py-2.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40 text-[11px] text-slate-300">
          {staff.map((s) => (
            <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-2 px-4">
                <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden shrink-0">
                  {s.photo ? <img src={s.photo} alt={s.name} className="w-full h-full object-cover" /> : (s.name || 'S').charAt(0)}
                </div>
              </td>
              <td className="py-2 px-4 font-medium text-white">{s.name || 'Unnamed'}</td>
              <td className="py-2 px-4 font-mono text-slate-400">{s.email || '—'}</td>
              <td className="py-2 px-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 border border-slate-700/60 text-indigo-300">
                  {s.role || 'Staff'}
                </span>
              </td>
              <td className="py-2 px-4 text-right space-x-1">
                <button onClick={() => onEdit(s)} className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white p-1 rounded transition cursor-pointer inline-flex"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => onDelete(s)} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-1 rounded transition cursor-pointer inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
