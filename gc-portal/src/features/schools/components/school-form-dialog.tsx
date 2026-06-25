'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schoolsService } from '../schools.service';
import type { SchoolType } from '../types';

interface SchoolFormDialogProps {
  open: boolean;
  onClose: () => void;
  instType: SchoolType;
  label: string;
}

export function SchoolFormDialog({ open, onClose, instType, label }: SchoolFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

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
    try {
      await schoolsService.create({ name, address, photo, instType });
      setName(''); setAddress(''); setPhoto('');
      onClose();
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-sm shadow-xl p-4 space-y-3 text-xs overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h3 className="font-bold text-white text-sm">Add {label}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-400 mb-0.5">Cover Image</label>
            <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
              <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {photo ? <img src={photo} className="w-full h-full object-cover" /> : <span className="text-slate-500">?</span>}
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-slate-700 file:text-slate-300 file:cursor-pointer" />
            </div>
          </div>
          <div><label className="block text-slate-400 mb-0.5">{label} Name</label><input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="block text-slate-400 mb-0.5">Address</label><input required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
