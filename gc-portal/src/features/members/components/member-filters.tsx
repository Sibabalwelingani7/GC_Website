'use client';

import { ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemberFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  deptFilter: string;
  onDeptChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortAsc: boolean;
  onToggleSort: () => void;
}

const DEPARTMENTS = ['all', 'Dance Stars', 'Choir', 'Film Stars'];
const STATUSES = ['all', 'Active', 'Inactive'];

export function MemberFilters({
  search, onSearchChange, deptFilter, onDeptChange, statusFilter, onStatusChange, sortAsc, onToggleSort,
}: MemberFiltersProps) {
  return (
    <div className="p-4 border-b border-slate-700/70 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Roster Control</span>
        <Button variant="outline" size="sm" onClick={onToggleSort}>
          {sortAsc ? <ArrowUpAZ className="w-3.5 h-3.5" /> : <ArrowDownAZ className="w-3.5 h-3.5" />}
          Sort: {sortAsc ? 'A-Z' : 'Z-A'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by name or campus..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[140px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <select value={deptFilter} onChange={(e) => onDeptChange(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer">
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer">
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : `${s} Only`}</option>)}
        </select>
      </div>
    </div>
  );
}
