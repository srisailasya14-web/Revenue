import { Card, CardHeader, Badge, Empty } from '@/components/ui';
import KpiGrid from '@/components/KpiGrid';
import DataTable from '@/components/DataTable';
import { DealStageChart, RevenueTrendChart } from '@/components/Charts';
import { Handshake, BarChart3, Trophy } from 'lucide-react';
import { formatINR, formatDate } from '@/utils/format';

export default function DealsView({ metrics, onLeadClick }) {
  const { kpis, raw, dealStages, revenueTrend } = metrics;
  const dKpis = kpis.filter((k) => ['deals', 'wonDeals', 'revenue', 'winRate'].includes(k.id));

  const wonDeals = raw.deals.filter((d) => d.stage === 'Closed Won');
  const lostDeals = raw.deals.filter((d) => d.stage === 'Closed Lost');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Deals & Revenue Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Pipeline value, win/loss, and revenue trend.</p>
      </div>

      <KpiGrid kpis={dKpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DealStageChart data={dealStages} icon={Handshake} />
        <RevenueTrendChart data={revenueTrend} icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Won Deals" subtitle="Closed won in period" icon={Trophy} />
          {wonDeals.length === 0 ? <Empty message="No won deals in this period" /> : (
            <div className="px-2 pb-4">
              <DataTable
                onRowClick={(row) => {
                  const lead = raw.leads.find((l) => l.id === row.leadId);
                  if (lead) onLeadClick(lead);
                }}
                initialSort={{ key: 'value', dir: 'desc' }}
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'company', label: 'Company' },
                  { key: 'value', label: 'Value', align: 'right', render: (r) => formatINR(r.value) },
                  { key: 'ownerName', label: 'Owner' },
                  { key: 'closedAt', label: 'Closed', render: (r) => formatDate(r.closedAt) },
                ]}
                rows={wonDeals}
              />
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Lost & Open Deals" subtitle="Pipeline still in play or lost" icon={Handshake} />
          {lostDeals.length + (raw.deals.length - wonDeals.length - lostDeals.length) === 0 ? <Empty /> : (
            <div className="px-2 pb-4">
              <DataTable
                onRowClick={(row) => {
                  const lead = raw.leads.find((l) => l.id === row.leadId);
                  if (lead) onLeadClick(lead);
                }}
                initialSort={{ key: 'createdAt', dir: 'desc' }}
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'company', label: 'Company' },
                  { key: 'stage', label: 'Stage', render: (r) => <Badge status={r.stage}>{r.stage}</Badge> },
                  { key: 'value', label: 'Value', align: 'right', render: (r) => formatINR(r.value) },
                  { key: 'createdAt', label: 'Created', render: (r) => formatDate(r.createdAt) },
                ]}
                rows={raw.deals.filter((d) => d.stage !== 'Closed Won')}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
