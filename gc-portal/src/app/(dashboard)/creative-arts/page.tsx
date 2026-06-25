'use client';

import { useState, useMemo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useCreativeArts } from '@/features/creative-arts/use-creative-arts';
import { creativeArtsService } from '@/features/creative-arts/creative-arts.service';
import { GroupCard } from '@/features/creative-arts/components/group-card';
import { GroupFormDialog } from '@/features/creative-arts/components/group-form-dialog';
import { GroupRosterDialog } from '@/features/creative-arts/components/group-roster-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import type { CreativeGroup } from '@/features/creative-arts/types';

export default function CreativeArtsPage() {
  const { groups, loading, error, getMemberCount, getMembersForGroup } = useCreativeArts();
  const { isAdminOrPastor } = usePermissions();
  const canManage = isAdminOrPastor();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<CreativeGroup | null>(null);
  const [viewGroup, setViewGroup] = useState<CreativeGroup | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter((g) => (g.name || '').toLowerCase().includes(q));
  }, [groups, search]);

  function handleEdit(g: CreativeGroup) { setEditGroup(g); setFormOpen(true); }
  function handleAdd() { setEditGroup(null); setFormOpen(true); }
  function handleDelete(g: CreativeGroup) {
    if (confirm('Are you sure you want to delete this department?')) {
      creativeArtsService.remove(g.id);
    }
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Creative Arts" />
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Creative Arts"
        description="Ministry departments and team roster"
        actions={canManage ? <Button size="sm" onClick={handleAdd}><Plus className="w-3.5 h-3.5" /> Add Department</Button> : undefined}
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No departments found" description="No creative arts departments exist yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <GroupCard key={g.id} group={g} memberCount={getMemberCount(g.name)} canManage={canManage} onEdit={handleEdit} onDelete={handleDelete} onClick={setViewGroup} />
          ))}
        </div>
      )}

      <GroupFormDialog open={formOpen} onClose={() => setFormOpen(false)} group={editGroup} />
      <GroupRosterDialog open={!!viewGroup} onClose={() => setViewGroup(null)} group={viewGroup} members={viewGroup ? getMembersForGroup(viewGroup.name) : []} />
    </div>
  );
}
