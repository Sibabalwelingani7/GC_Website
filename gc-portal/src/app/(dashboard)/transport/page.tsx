'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, Edit3, Trash2, Loader2 } from 'lucide-react';
import { useTransport } from '@/features/transport/use-transport';
import { transportService } from '@/features/transport/transport.service';
import { DriverFormDialog } from '@/features/transport/components/driver-form-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import type { Driver } from '@/features/transport/types';

export default function TransportPage() {
  const { drivers, loading } = useTransport();
  const { isAdminOrPastor } = usePermissions();
  const canManage = isAdminOrPastor();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);

  const filtered = useMemo(() => {
    let result = drivers;
    if (statusFilter !== 'all') result = result.filter((d) => d.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => (d.name || '').toLowerCase().includes(q) || (d.phone || '').toLowerCase().includes(q) || (d.vehicle || '').toLowerCase().includes(q));
    }
    return result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [drivers, search, statusFilter]);

  function handleEdit(d: Driver) { setEditDriver(d); setFormOpen(true); }
  function handleAdd() { setEditDriver(null); setFormOpen(true); }
  function handleDelete(d: Driver) {
    if (confirm('Delete this driver?')) transportService.remove(d.id);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Saturday Transport"
        description="Taxi driver registry and routes"
        actions={canManage ? <Button size="sm" onClick={handleAdd}><PlusCircle className="w-3.5 h-3.5" /> Add Driver</Button> : undefined}
      />

      <div className="bg-slate-800 rounded-xl border border-slate-700/70 overflow-hidden">
        <div className="p-4 border-b border-slate-700/70 flex flex-wrap gap-2">
          <input type="text" placeholder="Search name, phone, vehicle..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 min-w-[140px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer">
            <option value="all">All Statuses</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No drivers found" description="No transport drivers registered." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-slate-700/60 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-4 w-[50px]">Photo</th><th className="py-2.5 px-4">Name</th><th className="py-2.5 px-4">Phone</th><th className="py-2.5 px-4">Vehicle</th><th className="py-2.5 px-4">Capacity</th><th className="py-2.5 px-4">Route</th><th className="py-2.5 px-4">Status</th>{canManage && <th className="py-2.5 px-4 text-right">Actions</th>}
              </tr></thead>
              <tbody className="divide-y divide-slate-700/40 text-[11px] text-slate-300">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-4"><div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">{d.photo ? <img src={d.photo} className="w-full h-full object-cover" /> : (d.name || 'D').charAt(0)}</div></td>
                    <td className="py-2 px-4 font-medium text-white">{d.name}</td>
                    <td className="py-2 px-4 font-mono">{d.phone}</td>
                    <td className="py-2 px-4">{d.vehicle}</td>
                    <td className="py-2 px-4">{d.capacity}</td>
                    <td className="py-2 px-4">{d.route}</td>
                    <td className="py-2 px-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${d.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>{d.status}</span></td>
                    {canManage && <td className="py-2 px-4 text-right space-x-1"><button onClick={() => handleEdit(d)} className="text-indigo-400 hover:text-white p-1 rounded hover:bg-slate-700 transition cursor-pointer inline-flex"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(d)} className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-slate-700 transition cursor-pointer inline-flex"><Trash2 className="w-3.5 h-3.5" /></button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DriverFormDialog open={formOpen} onClose={() => setFormOpen(false)} driver={editDriver} />
    </div>
  );
}
