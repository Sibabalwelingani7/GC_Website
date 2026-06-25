'use client';

import { useState, useMemo } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { useMembers } from '@/features/members/use-members';
import { membersService } from '@/features/members/members.service';
import { MemberFilters } from '@/features/members/components/member-filters';
import { MembersTable } from '@/features/members/components/members-table';
import { MemberFormDialog } from '@/features/members/components/member-form-dialog';
import { MemberProfileDialog } from '@/features/members/components/member-profile-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import type { Member } from '@/features/members/types';

export default function MembersPage() {
  const { members, loading, error } = useMembers();
  const { isAdminOrPastor } = usePermissions();
  const canManage = isAdminOrPastor();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);

  const filtered = useMemo(() => {
    let result = members;
    if (deptFilter !== 'all') result = result.filter((m) => m.dept === deptFilter);
    if (statusFilter !== 'all') result = result.filter((m) => m.attendance === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => (m.name || '').toLowerCase().includes(q) || (m.target || '').toLowerCase().includes(q));
    }
    return result.sort((a, b) => sortAsc ? (a.name || '').localeCompare(b.name || '') : (b.name || '').localeCompare(a.name || ''));
  }, [members, search, deptFilter, statusFilter, sortAsc]);

  function handleEdit(m: Member) { setEditMember(m); setFormOpen(true); }
  function handleAdd() { setEditMember(null); setFormOpen(true); }
  function handleDelete(m: Member) {
    if (confirm('Are you sure you want to permanently remove this member?')) {
      membersService.remove(m.id);
    }
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Members Directory" />
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Members Directory"
        description="Youth roster and congregation profiles"
        actions={canManage ? <Button size="sm" onClick={handleAdd}><UserPlus className="w-3.5 h-3.5" /> Add Member</Button> : undefined}
      />

      <div className="bg-slate-800 rounded-xl border border-slate-700/70 overflow-hidden">
        <MemberFilters
          search={search} onSearchChange={setSearch}
          deptFilter={deptFilter} onDeptChange={setDeptFilter}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
          sortAsc={sortAsc} onToggleSort={() => setSortAsc(!sortAsc)}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No members found" description="Try adjusting your search or filter." />
        ) : (
          <MembersTable members={filtered} onEdit={handleEdit} onDelete={handleDelete} onView={setViewMember} />
        )}
      </div>

      <MemberFormDialog open={formOpen} onClose={() => setFormOpen(false)} member={editMember} />
      <MemberProfileDialog open={!!viewMember} onClose={() => setViewMember(null)} member={viewMember} />
    </div>
  );
}
