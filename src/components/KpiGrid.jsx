import { Card, ChangePill } from '@/components/ui';
import { formatINR, formatNumber } from '@/utils/format';
import {
  Users, FileText, IndianRupee, Handshake, Trophy, TrendingUp,
  ShoppingCart, Package, Wallet, AlertCircle, Target, Percent,
} from 'lucide-react';

const ICONS = {
  leads: Users,
  quotations: FileText,
  quotationValue: IndianRupee,
  deals: Handshake,
  wonDeals: Trophy,
  revenue: TrendingUp,
  orders: ShoppingCart,
  ordersValue: Package,
  collected: Wallet,
  outstanding: AlertCircle,
  winRate: Target,
  conversion: Percent,
};

function formatValue(kpi) {
  if (kpi.format === 'currency') return formatINR(kpi.value);
  if (kpi.format === 'percent') return `${kpi.value.toFixed(1)}%`;
  return formatNumber(kpi.value);
}

export default function KpiGrid({ kpis }) {
  if (!kpis || kpis.length === 0) {
    return <p className="text-sm text-slate-500">No KPI data for the selected filters.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
      {kpis.map((kpi) => {
        const Icon = ICONS[kpi.id] || Users;
        return (
          <Card
            key={kpi.id}
            className="p-3 hover:shadow-cardHover transition-shadow animate-fade-in"
          >
            <div className="flex items-start justify-between">
              <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Icon size={16} />
              </div>
              <ChangePill change={kpi.change} isAbsolute={kpi.isAbsolute} />
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-500 truncate">{kpi.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-slate-900 tabular-nums truncate">
              {formatValue(kpi)}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
