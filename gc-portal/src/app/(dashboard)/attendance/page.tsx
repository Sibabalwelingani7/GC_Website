'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Loader2, X } from 'lucide-react';
import { useAttendance } from '@/features/attendance/use-attendance';
import { attendanceService } from '@/features/attendance/attendance.service';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';

export default function AttendancePage() {
  const { records, loading, peakCount, avgCount } = useAttendance();
  const { isAdminOrPastor, isViewOnly } = usePermissions();
  const canWrite = isAdminOrPastor() && !isViewOnly('/attendance');
  const [formOpen, setFormOpen] = useState(false);
  const [date, setDate] = useState('');
  const [count, setCount] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !count) return;
    setSaving(true);
    await attendanceService.create(date, parseInt(count, 10));
    setDate(''); setCount(''); setFormOpen(false); setSaving(false);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this attendance record?')) attendanceService.remove(id);
  }

  function formatDate(d: string) {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Attendance Tracker"
        description="Service headcount analytics"
        actions={canWrite ? <Button size="sm" onClick={() => { setDate(new Date().toISOString().split('T')[0]); setFormOpen(true); }}><PlusCircle className="w-3.5 h-3.5" /> Record Headcount</Button> : undefined}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-800 border border-slate-700/70 p-4 rounded-xl">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Highest Attended</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">{peakCount.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-800 border border-slate-700/70 p-4 rounded-xl">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Average</p>
          <h3 className="text-xl font-bold text-indigo-400 mt-1">{avgCount.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/70 overflow-hidden">
        <div className="p-4 border-b border-slate-700/70 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Attendance Logs</span>
          <span className="text-[10px] text-slate-400">{records.length} entries</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
        ) : records.length === 0 ? (
          <EmptyState title="No records" description="No attendance headcounts recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-slate-700/60 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-400"><th className="py-3 px-5">Date</th><th className="py-3 px-5">Count</th>{canWrite && <th className="py-3 px-5 text-right">Actions</th>}</tr></thead>
              <tbody className="divide-y divide-slate-700/40 text-[11px] text-slate-300">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-5 font-medium text-white">{formatDate(r.date)}</td>
                    <td className="py-3 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-bold px-2.5 py-0.5 rounded border border-indigo-500/20 font-mono text-xs">{r.count.toLocaleString()} people</span></td>
                    {canWrite && <td className="py-3 px-5 text-right"><button onClick={() => handleDelete(r.id)} className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-900/50 transition cursor-pointer"><Trash2 className="w-4 h-4" /></button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-sm p-4 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <h3 className="font-bold text-white text-sm">Record Headcount</h3>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="block text-slate-400 mb-1">Date</label><input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="block text-slate-400 mb-1">Headcount</label><input type="number" min={0} required value={count} onChange={(e) => setCount(e.target.value)} placeholder="e.g. 150" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <Button variant="outline" size="sm" type="button" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button size="sm" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
