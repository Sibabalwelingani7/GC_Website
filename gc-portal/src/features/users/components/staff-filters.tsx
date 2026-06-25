'use client';

import { ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StaffFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  roleFilter: string;
  onRoleChange: (v: string) => void;
  sortAsc: boolean;
  onToggleSort: () => void;
}

export function StaffFilters({ search, onSearchChange, roleFilter, onRoleChange, sortAsc, onToggleSort }: StaffFiltersProps) {
  return (
    <div className="p-4 border-b border-slate-700/70 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Staff Controls</span>
        <Button variant="outline" size="sm" onClick={onToggleSort}>
          {sortAsc ? <ArrowUpAZ className="w-3.5 h-3.5" /> : <ArrowDownAZ className="w-3.5 h-3.5" />}
          Sort: {sortAsc ? 'A-Z' : 'Z-A'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[140px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <select value={roleFilter} onChange={(e) => onRoleChange(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer">
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Pastor">Pastor</option>
          <option value="Creative Arts Leader">Creative Arts Leader</option>
        </select>
      </div>
    </div>
  );
}
