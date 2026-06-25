'use client';

import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useMembers } from '@/features/members/use-members';
import { DataTable, type Column } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import type { Member } from '@/features/members/types';

const DEPARTMENTS = ['All', 'Dance Stars', 'Choir', 'Film Stars'];

export default function MembersPage() {
  const { members, loading, error } = useMembers();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const filtered = useMemo(() => {
    let result = members;
    if (deptFilter !== 'All') {
      result = result.filter((m) => m.dept === deptFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => (m.name || '').toLowerCase().includes(q));
    }
    return result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [members, search, deptFilter]);

  const columns: Column<Member>[] = [
    {
      key: 'avatar',
      label: 'Avatar',
      className: 'w-[50px]',
      render: (m) => (
        <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden shrink-0">
          {m.photo ? (
            <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
          ) : (
            (m.name || 'N').charAt(0)
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (m) => <span className="font-medium text-white">{m.name || 'Unnamed'}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (m) => <span className="font-mono">{m.phone || '—'}</span>,
    },
    {
      key: 'dept',
      label: 'Department',
      render: (m) => <span className="text-indigo-400 font-medium">{m.dept || '—'}</span>,
    },
    {
      key: 'target',
      label: 'Campus',
      render: (m) => m.target || '—',
    },
    {
      key: 'attendance',
      label: 'Status',
      render: (m) => {
        const active = m.attendance === 'Active';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
            {m.attendance || 'Unknown'}
          </span>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Members Directory" />
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Members Directory" description="Youth roster and congregation profiles" />

      <div className="bg-slate-800 rounded-xl border border-slate-700/70 overflow-hidden">
        <div className="p-4 border-b border-slate-700/70 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No members found" description="Try adjusting your search or filter." />
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={15} />
        )}
      </div>
    </div>
  );
}
