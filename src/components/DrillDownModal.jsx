import { X } from 'lucide-react';
import { Badge } from '@/components/ui';
import { formatINR, formatDate, formatDateTime } from '@/utils/format';
import {
  QUOTATIONS, DEALS, ORDERS, PAYMENTS,
} from '@/data/mockData';

// Drill-down modal showing a lead's full related chain.
export default function DrillDownModal({ lead, onClose }) {
  if (!lead) return null;

  const quotations = QUOTATIONS.filter((q) => q.leadId === lead.id);
  const deals = DEALS.filter((d) => d.leadId === lead.id);
  const orders = ORDERS.filter((o) => o.leadId === lead.id);
  const orderIds = new Set(orders.map((o) => o.id));
  const payments = PAYMENTS.filter((p) => orderIds.has(p.orderId));

  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const wonRevenue = wonDeals.reduce((s, d) => s + d.value, 0);
  const collected = payments.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter((p) => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
              <Badge status={lead.status}>{lead.status}</Badge>
              <Badge status={lead.priority}>{lead.priority}</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {lead.company} · {lead.source} · Owner {lead.ownerName} · {lead.department}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* Summary tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <MiniStat label="Lead Value" value={formatINR(lead.value)} />
            <MiniStat label="Quotations" value={quotations.length} />
            <MiniStat label="Won Revenue" value={formatINR(wonRevenue)} />
            <MiniStat label="Outstanding" value={formatINR(outstanding)} />
          </div>

          <Section title="Quotations">
            {quotations.length === 0 ? <Muted>No quotations</Muted> : (
              <DrillTable
                headers={['ID', 'Amount', 'Status', 'Created']}
                rows={quotations.map((q) => [q.id, formatINR(q.amount), <Badge status={q.status}>{q.status}</Badge>, formatDate(q.createdAt)])}
              />
            )}
          </Section>

          <Section title="Deals">
            {deals.length === 0 ? <Muted>No deals</Muted> : (
              <DrillTable
                headers={['ID', 'Title', 'Value', 'Stage', 'Created']}
                rows={deals.map((d) => [d.id, d.title, formatINR(d.value), <Badge status={d.stage}>{d.stage}</Badge>, formatDate(d.createdAt)])}
              />
            )}
          </Section>

          <Section title="Orders">
            {orders.length === 0 ? <Muted>No orders</Muted> : (
              <DrillTable
                headers={['Order #', 'Amount', 'Status', 'Created']}
                rows={orders.map((o) => [o.orderNumber, formatINR(o.amount), <Badge status={o.status}>{o.status}</Badge>, formatDate(o.createdAt)])}
              />
            )}
          </Section>

          <Section title="Payments">
            {payments.length === 0 ? <Muted>No payments</Muted> : (
              <DrillTable
                headers={['Payment #', 'Amount', 'Status', 'Method', 'Date']}
                rows={payments.map((p) => [p.paymentNumber, formatINR(p.amount), <Badge status={p.status}>{p.status}</Badge>, p.method, formatDate(p.date)])}
              />
            )}
          </Section>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <SummaryPill label="Collected" value={formatINR(collected)} tone="green" />
            <SummaryPill label="Outstanding" value={formatINR(outstanding)} tone="red" />
            <SummaryPill label="Created" value={formatDateTime(lead.createdAt)} tone="slate" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{title}</h4>
      {children}
    </div>
  );
}

function Muted({ children }) {
  return <p className="text-sm text-slate-400 italic">{children}</p>;
}

function DrillTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>{headers.map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              {r.map((c, j) => <td key={j} className="px-3 py-2 text-slate-700">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SummaryPill({ label, value, tone }) {
  const tones = {
    green: 'bg-green-50 text-green-700 ring-green-600/20',
    red: 'bg-red-50 text-red-700 ring-red-600/20',
    slate: 'bg-slate-50 text-slate-700 ring-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      <span className="opacity-70">{label}:</span> {value}
    </span>
  );
}
