import {
  LayoutDashboard, TrendingUp, FileText, Handshake, ShoppingCart,
  Wallet, AlertCircle, X,
} from 'lucide-react';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads & Funnel', icon: TrendingUp },
  { id: 'quotations', label: 'Quotations', icon: FileText },
  { id: 'deals', label: 'Deals & Revenue', icon: Handshake },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'outstanding', label: 'Outstanding', icon: AlertCircle },
];

export default function Sidebar({ active, onSelect, open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white font-bold shadow-sm">
              SR
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">SecureRegent</p>
              <p className="text-[11px] text-slate-500 leading-tight">Analytics CRM</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-500" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Dashboard
          </p>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSelect(item.id); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200">
          <div className="rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 p-4 text-white">
            <p className="text-xs font-medium opacity-90">Internship Project</p>
            <p className="text-sm font-semibold mt-0.5">Revenue Analytics</p>
            <p className="text-[11px] opacity-80 mt-1">SecureRegent Pvt. Ltd.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
