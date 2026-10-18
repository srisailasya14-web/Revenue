import { Card, CardHeader, Badge, Empty } from '@/components/ui';
import KpiGrid from '@/components/KpiGrid';
import DataTable from '@/components/DataTable';
import { PaymentStatusChart, PaymentMethodsChart, CollectionTrendChart } from '@/components/Charts';
import { Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { formatINR, formatDate } from '@/utils/format';

export default function PaymentsView({ metrics, onLeadClick }) {
  const { kpis, raw, paymentStatuses, paymentMethods, collectionTrend } = metrics;
  const pKpis = kpis.filter((k) => ['collected', 'outstanding'].includes(k.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Payments & Collection</h1>
        <p className="text-sm text-slate-500 mt-1">Collected vs outstanding, methods and trends.</p>
      </div>

      <KpiGrid kpis={pKpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PaymentStatusChart data={paymentStatuses} icon={Wallet} />
        <PaymentMethodsChart data={paymentMethods} icon={CreditCard} />
        <CollectionTrendChart data={collectionTrend} icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader title="All Payments" subtitle="Click to inspect related lead" icon={Wallet} />
        {raw.payments.length === 0 ? <Empty /> : (
          <div className="px-2 pb-4">
            <DataTable
              onRowClick={(row) => {
                const lead = raw.leads.find((l) => l.id === row.leadId);
                if (lead) onLeadClick(lead);
              }}
              initialSort={{ key: 'date', dir: 'desc' }}
              columns={[
                { key: 'paymentNumber', label: 'Payment #' },
                { key: 'company', label: 'Company' },
                { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatINR(r.amount) },
                { key: 'status', label: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
                { key: 'method', label: 'Method' },
                { key: 'ownerName', label: 'Owner' },
                { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
              ]}
              rows={raw.payments}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
