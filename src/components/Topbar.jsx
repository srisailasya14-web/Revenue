import { Calendar, Users, Building2, Menu, Download } from 'lucide-react';
import { rangeLabel } from '@/utils/dates';
import { USERS, DEPARTMENTS } from '@/data/mockData';

export default function Topbar({ filters, onMenu, onExport, exportLabel = 'Export CSV' }) {
  const {
    preset, setPreset, customStart, setCustomStart, customEnd, setCustomEnd,
    userId, setUserId, department, setDepartment, range,
  } = filters;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="px-4 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
        <button className="lg:hidden text-slate-600" onClick={onMenu}>
          <Menu size={22} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-slate-500">Reporting period</p>
          <p className="text-sm font-semibold text-slate-800 truncate">
            {rangeLabel(range)}
          </p>
        </div>

        {/* Date presets */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
          {filters.presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${preset === p.id ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom range */}
        {preset === 'custom' && (
          <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-2 py-1 border border-slate-200">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="text-xs bg-transparent text-slate-700 outline-none"
            />
            <span className="text-slate-400 text-xs">→</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="text-xs bg-transparent text-slate-700 outline-none"
            />
          </div>
        )}

        {/* User filter */}
        <div className="relative">
          <Users size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="pl-8 pr-7 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-brand-400 appearance-none cursor-pointer"
          >
            <option value="">All Users</option>
            {USERS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Department filter */}
        <div className="relative">
          <Building2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="pl-8 pr-7 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-brand-400 appearance-none cursor-pointer"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition"
          >
            <Download size={14} />
            {exportLabel}
          </button>
        )}
      </div>
    </header>
  );
}
