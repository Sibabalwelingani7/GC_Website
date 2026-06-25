'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transportService } from '../transport.service';
import type { Driver } from '../types';

interface DriverFormDialogProps {
  open: boolean;
  onClose: () => void;
  driver?: Driver | null;
}

export function DriverFormDialog({ open, onClose, driver }: DriverFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', capacity: '', route: '', status: 'Active' });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (driver) {
      setForm({ name: driver.name || '', phone: driver.phone || '', vehicle: driver.vehicle || '', capacity: String(driver.capacity || ''), route: driver.route || '', status: driver.status || 'Active' });
      setPhoto(driver.photo || '');
    } else {
      setForm({ name: '', phone: '', vehicle: '', capacity: '', route: '', status: 'Active' });
      setPhoto('');
    }
  }, [driver, open]);
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
    const payload = { ...form, capacity: parseInt(form.capacity) || 0, photo };
    try {
      if (driver) { await transportService.update(driver.id, payload); }
      else { await transportService.create(payload as Omit<Driver, 'id'>); }
      onClose();
    } catch { /* silent */ } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-xl p-4 space-y-3 text-xs overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h3 className="font-bold text-white text-sm">{driver ? 'Edit Driver' : 'Add Driver'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-400 mb-0.5">Photo</label>
            <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {photo ? <img src={photo} className="w-full h-full object-cover" /> : <span className="text-slate-500">{form.name?.charAt(0) || '?'}</span>}
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-slate-700 file:text-slate-300 file:cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-slate-400 mb-0.5">Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="block text-slate-400 mb-0.5">Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-slate-400 mb-0.5">Vehicle</label><input required value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="block text-slate-400 mb-0.5">Capacity</label><input type="number" min={1} required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          </div>
          <div><label className="block text-slate-400 mb-0.5">Route</label><input required value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="block text-slate-400 mb-0.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none">
              <option value="Active">Active</option><option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
