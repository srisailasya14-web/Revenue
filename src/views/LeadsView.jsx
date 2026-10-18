import { Card, CardHeader, Badge, Empty } from '@/components/ui';
import KpiGrid from '@/components/KpiGrid';
import DataTable from '@/components/DataTable';
import { FunnelChartCard, LeadSourcesChart, PriorityChart } from '@/components/Charts';
import { TrendingUp, PieChart as PieIcon, Flag, Users } from 'lucide-react';
import { formatINR, formatDate } from '@/utils/format';

export default function LeadsView({ metrics, onLeadClick }) {
  const { kpis, raw, funnel, leadSources, priorityBreakdown } = metrics;
  // Show only lead-related KPIs
  const leadKpis = kpis.filter((k) => ['leads', 'winRate', 'conversion'].includes(k.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Leads & Funnel</h1>
        <p className="text-sm text-slate-500 mt-1">
          Lead acquisition, funnel conversion and priority distribution.
        </p>
      </div>

      <KpiGrid kpis={leadKpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FunnelChartCard data={funnel} icon={TrendingUp} />
        <LeadSourcesChart data={leadSources} icon={PieIcon} />
        <PriorityChart data={priorityBreakdown} icon={Flag} />
      </div>

      <Card>
        <CardHeader title="All Leads" subtitle="Click a row to see quotations, deals, orders and payments" icon={Users} />
        {raw.leads.length === 0 ? <Empty /> : (
          <div className="px-2 pb-4">
            <DataTable
              onRowClick={onLeadClick}
              initialSort={{ key: 'createdAt', dir: 'desc' }}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Lead', render: (r) => (
                  <div>
                    <p className="font-medium text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.company}</p>
                  </div>
                )},
                { key: 'source', label: 'Source' },
                { key: 'stage', label: 'Stage' },
                { key: 'status', label: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
                { key: 'priority', label: 'Priority', render: (r) => <Badge status={r.priority}>{r.priority}</Badge> },
                { key: 'ownerName', label: 'Owner' },
                { key: 'value', label: 'Value', align: 'right', render: (r) => formatINR(r.value) },
                { key: 'createdAt', label: 'Created', render: (r) => formatDate(r.createdAt) },
              ]}
              rows={raw.leads}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
