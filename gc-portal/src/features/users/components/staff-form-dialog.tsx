'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usersService } from '../users.service';
import type { StaffUser } from '../types';

interface StaffFormDialogProps {
  open: boolean;
  onClose: () => void;
  user?: StaffUser | null;
}

export function StaffFormDialog({ open, onClose, user }: StaffFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: 'Admin' });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', role: user.role || 'Admin' });
      setPhoto(user.photo || '');
    } else {
      setForm({ name: '', email: '', role: 'Admin' });
      setPhoto('');
    }
    setPassword('');
  }, [user, open]);

  if (!open) return null;

  const isEdit = !!user;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEdit && password.length < 6) return;
    setLoading(true);

    const payload = { name: form.name, email: form.email, role: form.role, photo };

    try {
      if (isEdit) {
        await usersService.update(user.id, payload);
      } else {
        await usersService.create(payload);
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
          <h3 className="font-bold text-white text-sm">{isEdit ? 'Edit User' : 'Add User'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-400 mb-0.5">Profile Photo</label>
            <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {photo ? <img src={photo} className="w-full h-full object-cover" /> : <span className="text-slate-500 text-lg">{form.name?.charAt(0) || '?'}</span>}
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-slate-700 file:text-slate-300 file:cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-0.5">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-slate-400 mb-0.5">Email Address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-slate-400 mb-0.5">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-0.5">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none cursor-pointer">
              <option value="Admin">Admin</option>
              <option value="Pastor">Pastor</option>
              <option value="Creative Arts Leader">Creative Arts Leader</option>
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
