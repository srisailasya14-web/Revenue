import { Card, CardHeader, Badge, Empty } from '@/components/ui';
import KpiGrid from '@/components/KpiGrid';
import DataTable from '@/components/DataTable';
import { QuotationStatusChart } from '@/components/Charts';
import { FileText, PieChart as PieIcon } from 'lucide-react';
import { formatINR, formatDate } from '@/utils/format';

export default function QuotationsView({ metrics, onLeadClick }) {
  const { kpis, raw, quotationStatuses } = metrics;
  const qKpis = kpis.filter((k) => ['quotations', 'quotationValue'].includes(k.id));

  const total = quotationStatuses.reduce((s, q) => s + q.value, 0) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Quotation Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Quotation volume, value and status distribution.</p>
      </div>

      <KpiGrid kpis={qKpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QuotationStatusChart data={quotationStatuses} icon={PieIcon} />
        <Card className="lg:col-span-2">
          <CardHeader title="Status Summary" subtitle="Value share per status" icon={FileText} />
          <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-3 gap-3">
            {quotationStatuses.map((q) => (
              <div key={q.status} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <Badge status={q.status}>{q.status}</Badge>
                  <span className="text-xs text-slate-500">{((q.value / total) * 100).toFixed(1)}%</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{formatINR(q.value)}</p>
                <p className="text-xs text-slate-500">{q.count} quotations</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="All Quotations" subtitle="Click to inspect related lead" icon={FileText} />
        {raw.quotations.length === 0 ? <Empty /> : (
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
                { key: 'leadName', label: 'Lead' },
                { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatINR(r.amount) },
                { key: 'status', label: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
                { key: 'ownerName', label: 'Owner' },
                { key: 'createdAt', label: 'Created', render: (r) => formatDate(r.createdAt) },
              ]}
              rows={raw.quotations}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
