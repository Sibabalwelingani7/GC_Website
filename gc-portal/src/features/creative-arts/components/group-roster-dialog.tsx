'use client';

import { X, Palette } from 'lucide-react';
import type { CreativeGroup } from '../types';
import type { Member } from '@/features/members/types';

interface GroupRosterDialogProps {
  open: boolean;
  onClose: () => void;
  group: CreativeGroup | null;
  members: Member[];
}

export function GroupRosterDialog({ open, onClose, group, members }: GroupRosterDialogProps) {
  if (!open || !group) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-xl p-4 space-y-4 text-xs overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h3 className="font-bold text-white text-sm">{group.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-indigo-500/10 border border-indigo-500/20 overflow-hidden flex items-center justify-center shrink-0">
            {group.photo ? <img src={group.photo} className="w-full h-full object-cover" /> : <Palette className="w-8 h-8 text-indigo-400" />}
          </div>
          <div>
            <p className="text-slate-400 text-[11px]">Leader: <span className="text-white font-medium">{group.leader}</span></p>
            {group.desc && <p className="text-slate-500 text-[10px] mt-1">{group.desc}</p>}
            {group.scripture && <p className="text-indigo-400 text-[10px] font-mono mt-1">{group.scripture}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{members.length} Team Members</p>
          {members.length === 0 ? (
            <div className="py-6 text-center bg-slate-900/30 rounded-xl border border-slate-700/30 border-dashed">
              <p className="text-slate-500 text-[11px]">No members assigned to this department.</p>
            </div>
          ) : (
            members.map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 bg-slate-900/40 p-2.5 rounded-xl border border-slate-700/40">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden shrink-0">
                  {m.photo ? <img src={m.photo} className="w-full h-full object-cover" /> : (m.name || 'N').charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{m.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{m.phone || 'No contact'} • {m.occ || 'Member'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
