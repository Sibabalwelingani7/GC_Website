'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { membersService } from '../members.service';
import type { Member } from '../types';

interface MemberProfileDialogProps {
  open: boolean;
  onClose: () => void;
  member: Member | null;
}

export function MemberProfileDialog({ open, onClose, member }: MemberProfileDialogProps) {
  const { user } = useAuth();
  const [photo, setPhoto] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', dob: '', address: '' });
  const [loading, setLoading] = useState(false);

  const isOwnProfile = !!(user && member?.email && member.email.toLowerCase() === user.email?.toLowerCase());

  // Sync form when member changes
  if (member && form.name !== (member.name || '') && !loading) {
    setForm({ name: member.name || '', phone: member.phone || '', dob: member.dob || '', address: member.address || '' });
    setPhoto(member.photo || '');
  }

  if (!open || !member) return null;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setLoading(true);
    try {
      await membersService.update(member.id, { ...form, photo });
      onClose();
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }

  const affiliation = member.subData
    ? `${member.occ || ''} (${member.target || ''} — ${member.subData})`
    : `${member.occ || ''} (${member.target || ''})`;

  function formatDob(dob: string) {
    try {
      const d = new Date(dob);
      if (isNaN(d.getTime())) return dob;
      return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dob; }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSave} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative overflow-y-auto max-h-[95vh] space-y-6">
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer flex items-center gap-2 text-xs font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </button>

        {/* Header card */}
        <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative group w-32 h-32 shrink-0">
            <div className="w-32 h-32 rounded-xl bg-slate-700 border border-slate-600/50 overflow-hidden flex items-center justify-center text-4xl font-bold uppercase text-white">
              {photo ? <img src={photo} className="w-full h-full object-cover" /> : (member.name || 'N').charAt(0)}
            </div>
            {isOwnProfile && (
              <label className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-200 cursor-pointer opacity-0 group-hover:opacity-100 transition">
                Change Photo
                <input type="file" accept="image/*" onChange={handlePhoto} className="absolute inset-0 opacity-0 cursor-pointer" />
              </label>
            )}
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left w-full">
            {isOwnProfile ? (
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-lg font-bold text-white w-full focus:outline-none focus:border-indigo-500" />
            ) : (
              <h3 className="text-2xl font-bold text-white">{member.name || 'Unnamed'}</h3>
            )}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">{member.attendance}</span>
              <span className="bg-blue-950/60 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">{member.dept || 'Others'}</span>
            </div>
            <div className="text-xs text-sky-400 font-semibold">
              {isOwnProfile ? (
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-full max-w-[180px] focus:outline-none focus:border-indigo-500" />
              ) : (
                member.phone || 'N/A'
              )}
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <h4 className="text-slate-300 font-bold text-sm border-b border-slate-800 pb-2">Personal Info</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Date of Birth</p>
              {isOwnProfile ? (
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 w-full mt-1 focus:outline-none focus:border-indigo-500" />
              ) : (
                <p className="text-white font-bold text-sm mt-0.5">{member.dob ? formatDob(member.dob) : 'N/A'}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Address</p>
              {isOwnProfile ? (
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white w-full mt-1 focus:outline-none focus:border-indigo-500" />
              ) : (
                <p className="text-slate-200 font-medium mt-0.5">{member.address || 'N/A'}</p>
              )}
            </div>
            <div className="sm:col-span-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
              <p className="text-[10px] text-indigo-400 font-bold uppercase">Occupation & Affiliation</p>
              <p className="text-slate-100 font-medium mt-1 text-sm">{affiliation}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>Close</Button>
          {isOwnProfile && <Button size="sm" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>}
        </div>
      </form>
    </div>
  );
}
