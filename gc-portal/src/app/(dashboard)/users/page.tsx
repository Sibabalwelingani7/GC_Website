'use client';

import { useState, useMemo } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { useStaff } from '@/features/users/use-staff';
import { usersService } from '@/features/users/users.service';
import { StaffFilters } from '@/features/users/components/staff-filters';
import { StaffTable } from '@/features/users/components/staff-table';
import { StaffFormDialog } from '@/features/users/components/staff-form-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import type { StaffUser } from '@/features/users/types';

export default function UsersPage() {
  const { staff, loading, error } = useStaff();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<StaffUser | null>(null);

  const filtered = useMemo(() => {
    let result = staff;
    if (roleFilter !== 'all') result = result.filter((s) => s.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q));
    }
    return result.sort((a, b) => sortAsc ? (a.name || '').localeCompare(b.name || '') : (b.name || '').localeCompare(a.name || ''));
  }, [staff, search, roleFilter, sortAsc]);

  function handleEdit(u: StaffUser) { setEditUser(u); setFormOpen(true); }
  function handleAdd() { setEditUser(null); setFormOpen(true); }
  function handleDelete(u: StaffUser) {
    if (confirm('Permanently remove this staff user?')) {
      usersService.remove(u.id);
    }
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="System Users" />
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="System Users"
        description="Staff access control directory"
        actions={<Button size="sm" onClick={handleAdd}><UserPlus className="w-3.5 h-3.5" /> Add User</Button>}
      />

      <div className="bg-slate-800 rounded-xl border border-slate-700/70 overflow-hidden">
        <StaffFilters
          search={search} onSearchChange={setSearch}
          roleFilter={roleFilter} onRoleChange={setRoleFilter}
          sortAsc={sortAsc} onToggleSort={() => setSortAsc(!sortAsc)}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No staff found" description="Try adjusting your search or filter." />
        ) : (
          <StaffTable staff={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      <StaffFormDialog open={formOpen} onClose={() => setFormOpen(false)} user={editUser} />
    </div>
  );
}
