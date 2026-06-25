'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
}

export function DataTable<T>({ columns, data, pageSize = 10 }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const paged = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-400">
              {columns.map((col) => (
                <th key={col.key} className={`py-2.5 px-4 ${col.className || ''}`}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40 text-[11px] text-slate-300">
            {paged.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`py-2.5 px-4 ${col.className || ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/60 text-xs text-slate-400">
          <span>{data.length} total</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-slate-300">{page + 1} / {totalPages}</span>
            <Button variant="ghost" size="icon" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
