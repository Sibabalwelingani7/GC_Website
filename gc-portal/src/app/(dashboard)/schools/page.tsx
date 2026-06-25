'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useSchools } from '@/features/schools/use-schools';
import { schoolsService } from '@/features/schools/schools.service';
import { SchoolCard } from '@/features/schools/components/school-card';
import { SchoolFormDialog } from '@/features/schools/components/school-form-dialog';
import { SchoolMembersDialog } from '@/features/schools/components/school-members-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import { SCHOOL_TYPE_LABELS, type School, type SchoolType } from '@/features/schools/types';
import { cn } from '@/lib/utils';

const TABS: SchoolType[] = ['primary', 'high', 'uni'];

export default function SchoolsPage() {
  const [activeTab, setActiveTab] = useState<SchoolType>('primary');
  const { schools, loading, error, getMembersForSchool } = useSchools(activeTab);
  const { isAdminOrPastor } = usePermissions();
  const canManage = isAdminOrPastor();

  const [formOpen, setFormOpen] = useState(false);
  const [viewSchool, setViewSchool] = useState<School | null>(null);

  const labels = SCHOOL_TYPE_LABELS[activeTab];

  function handleDelete(s: School) {
    if (confirm(`Are you sure you want to delete ${s.name}?`)) {
      schoolsService.remove(s.id);
    }
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Schools" />
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={labels.title}
        description="Campus allocation roster"
        actions={canManage ? <Button size="sm" onClick={() => setFormOpen(true)}><Plus className="w-3.5 h-3.5" /> {labels.addLabel}</Button> : undefined}
      />

      <div className="flex gap-1 mb-4 bg-slate-800 p-1 rounded-lg border border-slate-700/70 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn('px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer', activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white')}
          >
            {SCHOOL_TYPE_LABELS[tab].title}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
      ) : schools.length === 0 ? (
        <EmptyState title={`No ${labels.title.toLowerCase()}`} description="No campuses registered yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map((s) => (
            <SchoolCard key={s.id} school={s} canManage={canManage} onDelete={handleDelete} onClick={setViewSchool} />
          ))}
        </div>
      )}

      <SchoolFormDialog open={formOpen} onClose={() => setFormOpen(false)} instType={activeTab} label={labels.singular} />
      <SchoolMembersDialog open={!!viewSchool} onClose={() => setViewSchool(null)} school={viewSchool} getMembers={getMembersForSchool} />
    </div>
  );
}
