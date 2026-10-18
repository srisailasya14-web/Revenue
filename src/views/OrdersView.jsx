import { Card, CardHeader, Badge, Empty } from '@/components/ui';
import KpiGrid from '@/components/KpiGrid';
import DataTable from '@/components/DataTable';
import { OrderStatusChart } from '@/components/Charts';
import { ShoppingCart, Package } from 'lucide-react';
import { formatINR, formatDate } from '@/utils/format';

export default function OrdersView({ metrics, onLeadClick }) {
  const { kpis, raw, orderStatuses } = metrics;
  const oKpis = kpis.filter((k) => ['orders', 'ordersValue'].includes(k.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">Fulfilment status and order value.</p>
      </div>

      <KpiGrid kpis={oKpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <OrderStatusChart data={orderStatuses} icon={ShoppingCart} />
        <Card className="lg:col-span-2">
          <CardHeader title="Status Summary" subtitle="Value per order status" icon={Package} />
          <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {orderStatuses.map((o) => (
              <div key={o.status} className="rounded-xl border border-slate-200 p-3">
                <Badge status={o.status}>{o.status}</Badge>
                <p className="mt-2 text-sm font-semibold text-slate-900">{formatINR(o.value)}</p>
                <p className="text-xs text-slate-500">{o.count} orders</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="All Orders" subtitle="Click to inspect related lead" icon={ShoppingCart} />
        {raw.orders.length === 0 ? <Empty /> : (
          <div className="px-2 pb-4">
            <DataTable
              onRowClick={(row) => {
                const lead = raw.leads.find((l) => l.id === row.leadId);
                if (lead) onLeadClick(lead);
              }}
              initialSort={{ key: 'createdAt', dir: 'desc' }}
              columns={[
                { key: 'orderNumber', label: 'Order #' },
                { key: 'company', label: 'Company' },
                { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatINR(r.amount) },
                { key: 'status', label: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
                { key: 'ownerName', label: 'Owner' },
                { key: 'createdAt', label: 'Created', render: (r) => formatDate(r.createdAt) },
              ]}
              rows={raw.orders}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
