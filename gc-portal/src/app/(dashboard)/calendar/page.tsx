'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Loader2, X, MapPin, Clock } from 'lucide-react';
import { useCalendar } from '@/features/calendar/use-calendar';
import { calendarService } from '@/features/calendar/calendar.service';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';

function formatDate(d: string) {
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CalendarPage() {
  const { events, loading } = useCalendar();
  const { isAdminOrPastor } = usePermissions();
  const canWrite = isAdminOrPastor();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '' });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await calendarService.create(form);
    setForm({ title: '', date: '', time: '', location: '' }); setFormOpen(false); setSaving(false);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this event?')) calendarService.remove(id);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Calendar"
        description="Upcoming church events"
        actions={canWrite ? <Button size="sm" onClick={() => { setForm({ ...form, date: new Date().toISOString().split('T')[0] }); setFormOpen(true); }}><PlusCircle className="w-3.5 h-3.5" /> Add Event</Button> : undefined}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
      ) : events.length === 0 ? (
        <EmptyState title="No events" description="No calendar events scheduled." />
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="bg-slate-800 border border-slate-700/70 rounded-xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{ev.title}</h4>
                <p className="text-xs text-slate-400">{formatDate(ev.date)}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  {ev.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>}
                  {ev.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>}
                </div>
              </div>
              {canWrite && (
                <button onClick={() => handleDelete(ev.id)} className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-900/50 transition cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-sm p-4 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <h3 className="font-bold text-white text-sm">Add Event</h3>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="block text-slate-400 mb-1">Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-slate-400 mb-1">Date</label><input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
                <div><label className="block text-slate-400 mb-1">Time</label><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
              </div>
              <div><label className="block text-slate-400 mb-1">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
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
