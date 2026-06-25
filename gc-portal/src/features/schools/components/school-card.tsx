'use client';

import { useRef } from 'react';
import { Trash2, Camera, GraduationCap } from 'lucide-react';
import { schoolsService } from '../schools.service';
import type { School } from '../types';

interface SchoolCardProps {
  school: School;
  canManage: boolean;
  onDelete: (s: School) => void;
  onClick: (s: School) => void;
}

export function SchoolCard({ school, canManage, onDelete, onClick }: SchoolCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => schoolsService.updatePhoto(school.id, ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div onClick={() => onClick(school)} className="bg-slate-800 p-4 rounded-xl border border-slate-700/70 flex items-center justify-between shadow-sm hover:border-indigo-500 transition-all cursor-pointer group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-11 h-11 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0 overflow-hidden group/avatar">
          {school.photo ? <img src={school.photo} className="w-full h-full object-cover" /> : <GraduationCap className="w-5 h-5 text-indigo-400" />}
          {canManage && (
            <div onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition cursor-pointer">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors truncate">{school.name}</h4>
          <p className="text-slate-400 text-[11px] mt-0.5 truncate">{school.address || 'No address'}</p>
        </div>
      </div>
      {canManage && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(school); }} className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-900/50 transition cursor-pointer shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
