import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { statusClass } from '@/utils/theme';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/70 shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 h-9 w-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusClass(status)} ${className}`}
    >
      {children}
    </span>
  );
}

export function ChangePill({ change, isAbsolute = false }) {
  if (change === null || change === undefined || isNaN(change)) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  const positive = isAbsolute ? change >= 0 : change >= 0;
  // For "outstanding" lower is better — but we keep it simple and show raw direction.
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  const color = positive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';
  const val = isAbsolute ? `${change.toFixed(1)} pts` : `${change.toFixed(1)}%`;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${color}`}>
      <Icon size={12} />
      {val}
    </span>
  );
}

export function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`text-base font-semibold text-slate-800 ${className}`}>{children}</h2>
  );
}

export function Empty({ message = 'No data for the selected filters' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
        <span className="text-slate-400">∅</span>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
