'use client';

import { Edit3, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { membersService } from '../members.service';
import type { Member } from '../types';

interface MembersTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onView: (member: Member) => void;
}

export function MembersTable({ members, onEdit, onDelete, onView }: MembersTableProps) {
  const { isAdminOrPastor } = usePermissions();
  const canManage = isAdminOrPastor();

  function handleAttendanceChange(id: string, status: string) {
    membersService.updateAttendance(id, status);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700/60 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-400">
            <th className="py-2.5 px-4 w-[50px]">Avatar</th>
            <th className="py-2.5 px-4">Name</th>
            <th className="py-2.5 px-4">Phone</th>
            <th className="py-2.5 px-4">Department</th>
            <th className="py-2.5 px-4">Occupation</th>
            <th className="py-2.5 px-4">Campus</th>
            <th className="py-2.5 px-4">Status</th>
            {canManage && <th className="py-2.5 px-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40 text-[11px] text-slate-300">
          {members.map((m) => {
            const active = m.attendance === 'Active';
            return (
              <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2 px-4">
                  <div onClick={() => onView(m)} className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden shrink-0 cursor-pointer hover:border-indigo-400 transition">
                    {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" /> : (m.name || 'N').charAt(0)}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div onClick={() => onView(m)} className="font-medium text-white cursor-pointer hover:text-indigo-400 transition">{m.name || 'Unnamed'}</div>
                  <div className="text-[9px] text-slate-500">DOB: {m.dob || 'N/A'}</div>
                </td>
                <td className="py-2 px-4 font-mono">{m.phone || '—'}</td>
                <td className="py-2 px-4 text-indigo-400 font-medium">{m.dept || '—'}</td>
                <td className="py-2 px-4"><span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700/60 text-slate-300 font-medium">{m.occ || '—'}</span></td>
                <td className="py-2 px-4 text-slate-200">{m.target || '—'}</td>
                <td className="py-2 px-4">
                  {canManage ? (
                    <select
                      value={m.attendance || 'Active'}
                      onChange={(e) => handleAttendanceChange(m.id, e.target.value)}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold border focus:outline-none cursor-pointer ${active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                      {m.attendance || 'Unknown'}
                    </span>
                  )}
                </td>
                {canManage && (
                  <td className="py-2 px-4 text-right space-x-1">
                    <button onClick={() => onEdit(m)} className="text-indigo-400 hover:text-white p-1 rounded hover:bg-slate-700 transition cursor-pointer inline-flex"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onDelete(m)} className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-slate-700 transition cursor-pointer inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
