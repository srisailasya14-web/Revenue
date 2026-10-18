import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Empty } from '@/components/ui';

// columns: [{ key, label, align?, sortable?, render?, width? }]
export default function DataTable({ columns, rows, emptyMessage, onRowClick, initialSort }) {
  const [sort, setSort] = useState(initialSort || { key: null, dir: 'desc' });

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue ? col.sortValue(a) : a[sort.key];
      const bv = col.sortValue ? col.sortValue(b) : b[sort.key];
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [rows, sort, columns]);

  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key !== key) return { key, dir: 'asc' };
      if (s.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: 'desc' };
    });
  };

  if (!rows || rows.length === 0) {
    return <Empty message={emptyMessage || 'No rows for the selected filters'} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((col) => {
              const active = sort.key === col.key;
              return (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-2.5 text-xs font-semibold text-slate-500 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.sortable === false ? (
                    <span>{col.label}</span>
                  ) : (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className={`inline-flex items-center gap-1 hover:text-slate-800 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}
                    >
                      {col.label}
                      {active ? (
                        sort.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                      ) : (
                        <ChevronsUpDown size={13} className="text-slate-300" />
                      )}
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-slate-100 last:border-0 transition
                ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-slate-700 ${col.align === 'right' ? 'text-right tabular-nums' : ''}`}
                >
                  {col.render ? col.render(row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable };
