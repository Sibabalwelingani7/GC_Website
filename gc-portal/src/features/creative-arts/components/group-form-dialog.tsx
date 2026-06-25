'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { creativeArtsService } from '../creative-arts.service';
import type { CreativeGroup } from '../types';

interface GroupFormDialogProps {
  open: boolean;
  onClose: () => void;
  group?: CreativeGroup | null;
}

export function GroupFormDialog({ open, onClose, group }: GroupFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [form, setForm] = useState({ name: '', leader: '', subtitle: '', desc: '', scripture: '' });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (group) {
      setForm({ name: group.name || '', leader: group.leader || '', subtitle: group.subtitle || '', desc: group.desc || '', scripture: group.scripture || '' });
      setPhoto(group.photo || '');
    } else {
      setForm({ name: '', leader: '', subtitle: '', desc: '', scripture: '' });
      setPhoto('');
    }
  }, [group, open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!open) return null;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, photo };
    try {
      if (group) {
        await creativeArtsService.update(group.id, payload);
      } else {
        await creativeArtsService.create(payload as Omit<CreativeGroup, 'id'>);
      }
      onClose();
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-sm shadow-xl p-4 space-y-3 text-xs overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h3 className="font-bold text-white text-sm">{group ? 'Edit Department' : 'Add Department'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-400 mb-0.5">Cover Image</label>
            <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
              <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {photo ? <img src={photo} className="w-full h-full object-cover" /> : <span className="text-slate-500 text-sm">?</span>}
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-slate-700 file:text-slate-300 file:cursor-pointer" />
            </div>
          </div>
          <div><label className="block text-slate-400 mb-0.5">Department Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="block text-slate-400 mb-0.5">Leader</label><input required value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="block text-slate-400 mb-0.5">Subtitle</label><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="block text-slate-400 mb-0.5">Description</label><textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 resize-none" /></div>
          <div><label className="block text-slate-400 mb-0.5">Scripture Reference</label><input value={form.scripture} onChange={(e) => setForm({ ...form, scripture: e.target.value })} placeholder="e.g. Romans 12:1" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
