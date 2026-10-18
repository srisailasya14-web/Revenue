import { Card, CardHeader, Badge, Empty } from '@/components/ui';
import DataTable from '@/components/DataTable';
import { AlertCircle, Clock, CalendarClock } from 'lucide-react';
import { formatINR, formatDate } from '@/utils/format';
import { exportToCSV } from '@/utils/csv';

export default function OutstandingView({ metrics, onLeadClick, filters }) {
  const { outstandingPayments, totals } = metrics;
  const overdue = outstandingPayments.filter((p) => p.status === 'Overdue');
  const pending = outstandingPayments.filter((p) => p.status === 'Pending');

  const totalOutstanding = outstandingPayments.reduce((s, p) => s + p.amount, 0);
  const overdueAmount = overdue.reduce((s, p) => s + p.amount, 0);
  const pendingAmount = pending.reduce((s, p) => s + p.amount, 0);

  const handleExport = () => {
    exportToCSV('outstanding-payments.csv', outstandingPayments, [
      { key: 'paymentNumber', label: 'Payment #' },
      { key: 'company', label: 'Company' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'method', label: 'Method' },
      { key: 'ownerName', label: 'Owner' },
      { key: 'department', label: 'Department' },
      { key: 'dueDate', label: 'Due Date' },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Outstanding Revenue</h1>
          <p className="text-sm text-slate-500 mt-1">Pending and overdue receivables.</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition"
        >
          <AlertCircle size={14} /> Export Outstanding
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile icon={AlertCircle} label="Total Outstanding" value={formatINR(totalOutstanding)} tone="red" />
        <StatTile icon={Clock} label="Pending" value={formatINR(pendingAmount)} sub={`${pending.length} payments`} tone="amber" />
        <StatTile icon={CalendarClock} label="Overdue" value={formatINR(overdueAmount)} sub={`${overdue.length} payments`} tone="red" />
      </div>

      <Card>
        <CardHeader title="Outstanding Payments" subtitle="Sorted by due date — click to inspect lead" icon={AlertCircle} />
        {outstandingPayments.length === 0 ? <Empty message="No outstanding payments in this period" /> : (
          <div className="px-2 pb-4">
            <DataTable
              onRowClick={(row) => {
                const lead = metrics.raw.leads.find((l) => l.id === row.leadId);
                if (lead) onLeadClick(lead);
              }}
              initialSort={{ key: 'dueDate', dir: 'asc' }}
              columns={[
                { key: 'paymentNumber', label: 'Payment #' },
                { key: 'company', label: 'Company' },
                { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatINR(r.amount) },
                { key: 'status', label: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
                { key: 'method', label: 'Method' },
                { key: 'ownerName', label: 'Owner' },
                { key: 'dueDate', label: 'Due Date', render: (r) => formatDate(r.dueDate) },
              ]}
              rows={outstandingPayments}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub, tone }) {
  const tones = {
    red: 'bg-red-50 text-red-700 ring-red-600/20',
    amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    green: 'bg-green-50 text-green-700 ring-green-600/20',
  };
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ring-1 ring-inset ${tones[tone]}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-semibold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-500">{sub}</p>}
        </div>
      </div>
    </Card>
  );
}
