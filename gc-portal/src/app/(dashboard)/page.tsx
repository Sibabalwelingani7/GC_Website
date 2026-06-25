'use client';

import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { staffData, role } = useAuth();
  const firstName = staffData?.name?.split(' ')[0] || 'Staff';

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-white">Welcome, {firstName}</h1>
      <p className="text-sm text-slate-400 mt-1">Role: {role}</p>
    </div>
  );
}
