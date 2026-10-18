import { Card, CardHeader, Badge, Empty } from '@/components/ui';
import KpiGrid from '@/components/KpiGrid';
import DataTable from '@/components/DataTable';
import {
  FunnelChartCard, LeadTrendChart, LeadSourcesChart, QuotationStatusChart,
  RevenueTrendChart, CollectionTrendChart, OrderStatusChart,
  PaymentStatusChart, DepartmentChart, PriorityChart,
} from '@/components/Charts';
import {
  TrendingUp, Activity, PieChart as PieIcon, FileText, BarChart3,
  ShoppingCart, Wallet, Building2, Flag, Users, Clock3,
} from 'lucide-react';
import { formatINR, formatDate } from '@/utils/format';

function buildRecentActivity(raw) {
  const activities = [
    ...raw.leads.map((row) => ({ ...row, type: 'Lead created', date: row.createdAt })),
    ...raw.quotations.map((row) => ({ ...row, type: `Quotation ${row.status.toLowerCase()}`, date: row.createdAt })),
    ...raw.deals.map((row) => ({ ...row, type: `Deal ${row.stage.toLowerCase()}`, date: row.createdAt })),
    ...raw.orders.map((row) => ({ ...row, type: `Order ${row.status.toLowerCase()}`, date: row.createdAt })),
    ...raw.payments.map((row) => ({ ...row, type: `Payment ${row.status.toLowerCase()}`, date: row.date })),
  ];
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
}

function SummaryStat({ label, value, detail, tone = 'blue' }) {
  const tones = {
    blue: 'bg-brand-50 text-brand-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold ${tones[tone]}`}>{label}</div>
      <p className="mt-2 text-base font-semibold text-slate-900 tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p>
    </div>
  );
}

export default function OverviewView({ metrics, onLeadClick }) {
  const {
    kpis, raw, funnel, leadTrend, leadSources, quotationStatuses,
    revenueTrend, collectionTrend, orderStatuses, paymentStatuses,
    departmentBreakdown, priorityBreakdown, topPerformers,
  } = metrics;
  const recentActivity = buildRecentActivity(raw);
  const quotationTotal = quotationStatuses.reduce((total, item) => total + item.value, 0);
  const orderTotal = orderStatuses.reduce((total, item) => total + item.value, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Business Performance</h1>
          <p className="mt-1 text-xs text-slate-500">Leads, quotations, revenue and operations at a glance.</p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500">
          <Activity size={14} className="text-brand-600" /> Live local analytics
        </div>
      </div>

      <KpiGrid kpis={kpis} />

      <section>
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-800">Lead Analytics</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
          <FunnelChartCard data={funnel} icon={TrendingUp} />
          <LeadTrendChart data={leadTrend} icon={Activity} />
          <LeadSourcesChart data={leadSources} icon={PieIcon} />
          <PriorityChart data={priorityBreakdown} icon={Flag} />
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-2">
          <FileText size={16} className="text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-800">Quotation Analytics</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <QuotationStatusChart data={quotationStatuses} icon={FileText} />
          <Card className="xl:col-span-2">
            <CardHeader title="Quotation Status Summary" subtitle="Value and volume across the selected period" icon={FileText} />
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 px-5 pb-5">
              {quotationStatuses.map((item) => (
                <SummaryStat
                  key={item.status}
                  label={item.status}
                  value={formatINR(item.value)}
                  detail={`${item.count} quotations · ${quotationTotal ? ((item.value / quotationTotal) * 100).toFixed(0) : 0}% value`}
                  tone={item.status === 'Approved' ? 'green' : item.status === 'Rejected' ? 'red' : 'blue'}
                />
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-2">
          <BarChart3 size={16} className="text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-800">Deals & Revenue</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <div className="xl:col-span-2"><RevenueTrendChart data={revenueTrend} icon={BarChart3} /></div>
          <DepartmentChart data={departmentBreakdown} icon={Building2} />
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-2">
          <ShoppingCart size={16} className="text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-800">Orders & Payments</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
          <OrderStatusChart data={orderStatuses} icon={ShoppingCart} />
          <PaymentStatusChart data={paymentStatuses} icon={Wallet} />
          <div className="xl:col-span-2"><CollectionTrendChart data={collectionTrend} icon={Wallet} /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <SummaryStat label="Order Value" value={formatINR(orderTotal)} detail={`${raw.orders.length} orders`} />
          <SummaryStat label="Collected" value={formatINR(metrics.totals.paymentsCollected)} detail="Paid payments" tone="green" />
          <SummaryStat label="Pending" value={formatINR(metrics.totals.paymentsPending)} detail="Awaiting collection" tone="amber" />
          <SummaryStat label="Overdue" value={formatINR(metrics.totals.paymentsOverdue)} detail="Needs attention" tone="red" />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent Activity" subtitle="Latest records across the CRM" icon={Clock3} />
          {recentActivity.length === 0 ? <Empty /> : (
            <div className="px-2 pb-4">
              <DataTable
                onRowClick={(row) => {
                  const lead = raw.leads.find((leadRow) => leadRow.id === row.leadId);
                  if (lead) onLeadClick(lead);
                }}
                initialSort={{ key: 'date', dir: 'desc' }}
                columns={[
                  { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
                  { key: 'type', label: 'Activity', render: (row) => <Badge status={row.status}>{row.type}</Badge> },
                  { key: 'company', label: 'Company' },
                  { key: 'ownerName', label: 'Owner' },
                  { key: 'amount', label: 'Value', align: 'right', render: (row) => row.amount ? formatINR(row.amount) : row.value ? formatINR(row.value) : '—' },
                ]}
                rows={recentActivity}
              />
            </div>
          )}
        </Card>
        <Card>
          <CardHeader title="Top Performers" subtitle="Won revenue in period" icon={Users} />
          {topPerformers.length === 0 ? <Empty /> : (
            <div className="px-2 pb-4">
              <DataTable
                initialSort={{ key: 'revenue', dir: 'desc' }}
                columns={[
                  { key: 'name', label: 'User', render: (row) => (
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-semibold">
                        {row.name.split(' ').map((name) => name[0]).join('')}
                      </div>
                      <div><p className="font-medium text-slate-800">{row.name}</p><p className="text-[10px] text-slate-500">{row.dept}</p></div>
                    </div>
                  )},
                  { key: 'won', label: 'Won', align: 'right' },
                  { key: 'revenue', label: 'Revenue', align: 'right', render: (row) => formatINR(row.revenue) },
                ]}
                rows={topPerformers}
              />
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
