'use client';

import { useRef } from 'react';
import { Edit3, Trash2, Camera, Palette } from 'lucide-react';
import { creativeArtsService } from '../creative-arts.service';
import type { CreativeGroup } from '../types';

interface GroupCardProps {
  group: CreativeGroup;
  memberCount: number;
  canManage: boolean;
  onEdit: (g: CreativeGroup) => void;
  onDelete: (g: CreativeGroup) => void;
  onClick: (g: CreativeGroup) => void;
}

export function GroupCard({ group, memberCount, canManage, onEdit, onDelete, onClick }: GroupCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleInlinePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      creativeArtsService.updatePhoto(group.id, ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div onClick={() => onClick(group)} className="bg-slate-800 p-4 rounded-xl border border-slate-700/70 flex items-center justify-between shadow-sm hover:border-indigo-500 transition-all cursor-pointer group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-11 h-11 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0 overflow-hidden group/avatar">
          {group.photo ? <img src={group.photo} className="w-full h-full object-cover" /> : <Palette className="w-5 h-5 text-indigo-400" />}
          {canManage && (
            <div
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInlinePhoto} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors truncate">{group.name}</h4>
          <p className="text-slate-400 text-[11px] mt-0.5 truncate">Leader: <span className="text-slate-200 font-medium">{group.leader}</span></p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
              {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
            </span>
            {group.scripture && <span className="text-slate-500 text-[10px] font-mono truncate">{group.scripture}</span>}
          </div>
        </div>
      </div>
      {canManage && (
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onEdit(group); }} className="text-slate-500 hover:text-indigo-400 p-1.5 rounded hover:bg-slate-900/50 transition cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(group); }} className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-900/50 transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      )}
    </div>
  );
}
