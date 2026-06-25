'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCampuses } from '../use-campuses';
import { membersService } from '../members.service';
import type { Member } from '../types';

interface MemberFormDialogProps {
  open: boolean;
  onClose: () => void;
  member?: Member | null;
}

export function MemberFormDialog({ open, onClose, member }: MemberFormDialogProps) {
  const { getCampusesByType } = useCampuses();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', address: '', dob: '', dept: 'Dance Stars', occ: 'Primary School', target: '', sub1: '', sub2: '',
  });

  useEffect(() => {
    if (member) {
      const parts = member.subData?.split(' - Year ') || ['', ''];
      setForm({
        name: member.name || '', phone: member.phone || '', address: member.address || '',
        dob: member.dob || '', dept: member.dept || 'Dance Stars', occ: member.occ || 'Primary School',
        target: member.target || '', sub1: parts[0] || '', sub2: parts[1] || '',
      });
      setPhoto(member.photo || '');
    } else {
      setForm({ name: '', phone: '', address: '', dob: '', dept: 'Dance Stars', occ: 'Primary School', target: '', sub1: '', sub2: '' });
      setPhoto('');
    }
  }, [member, open]);

  if (!open) return null;

  const occType = form.occ === 'Primary School' ? 'primary' : form.occ === 'High School' ? 'high' : (form.occ === 'University' || form.occ === 'College') ? 'higher' : '';
  const campusOptions = occType ? getCampusesByType(occType) : [];
  const isHigherEd = form.occ === 'University' || form.occ === 'College';
  const isWork = form.occ === 'Work';

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

    const subData = isHigherEd ? `${form.sub1} - Year ${form.sub2}` : '';
    const payload = {
      name: form.name, phone: form.phone, address: form.address, dob: form.dob,
      dept: form.dept, occ: form.occ, target: form.target, subData, photo,
    };

    try {
      if (member) {
        await membersService.update(member.id, payload);
      } else {
        await membersService.create({ ...payload, attendance: 'Active' } as Omit<Member, 'id'>);
      }
      onClose();
    } catch (err) {
      // Error handled silently — Firestore will reflect state
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-xl p-4 space-y-3 text-xs overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h3 className="font-bold text-white text-sm">{member ? 'Update Member' : 'Add Member'}</h3>
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

          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-slate-400 mb-0.5">Full Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="block text-slate-400 mb-0.5">Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-slate-400 mb-0.5">Address</label><input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="block text-slate-400 mb-0.5">Date of Birth</label><input type="date" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-indigo-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-slate-400 mb-0.5">Department</label>
              <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none">
                <option value="Dance Stars">Dance Stars</option><option value="Choir">The Choir / Worshipers</option><option value="Film Stars">Film Stars</option>
              </select>
            </div>
            <div><label className="block text-slate-400 mb-0.5">Occupation</label>
              <select value={form.occ} onChange={(e) => setForm({ ...form, occ: e.target.value, target: '', sub1: '', sub2: '' })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none">
                <option value="Primary School">Primary School</option><option value="High School">High School</option><option value="University">University</option><option value="College">College</option><option value="Work">Employed</option>
              </select>
            </div>
          </div>

          {/* Conditional fields based on occupation */}
          <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-700/50 space-y-2">
            {isWork ? (
              <div><label className="block text-slate-400 mb-1">Workplace</label><input required value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="e.g. Standard Bank" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
            ) : (
              <>
                <div>
                  <label className="block text-slate-400 mb-1">{form.occ === 'Primary School' ? 'Primary School' : form.occ === 'High School' ? 'High School' : 'Institution'}</label>
                  <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none">
                    {campusOptions.length === 0 ? <option disabled>No campuses found</option> : campusOptions.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                {isHigherEd && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-slate-400 mb-0.5">Course/Major</label><input required value={form.sub1} onChange={(e) => setForm({ ...form, sub1: e.target.value })} placeholder="e.g. BSc IT" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
                    <div><label className="block text-slate-400 mb-0.5">Year</label><input type="number" min={1} max={7} required value={form.sub2} onChange={(e) => setForm({ ...form, sub2: e.target.value })} placeholder="1" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500" /></div>
                  </div>
                )}
              </>
            )}
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
