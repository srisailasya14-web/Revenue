// Shared color tokens for charts and status badges.
export const CHART_COLORS = {
  blue: '#2563eb',
  sky: '#0ea5e9',
  teal: '#14b8a6',
  green: '#16a34a',
  amber: '#d97706',
  orange: '#ea580c',
  red: '#dc2626',
  violet: '#7c3aed',
  pink: '#db2777',
  slate: '#64748b',
};

export const PALETTE = [
  CHART_COLORS.blue, CHART_COLORS.sky, CHART_COLORS.teal,
  CHART_COLORS.green, CHART_COLORS.amber, CHART_COLORS.orange,
  CHART_COLORS.red, CHART_COLORS.violet, CHART_COLORS.pink, CHART_COLORS.slate,
];

export const STATUS_STYLES = {
  // Leads
  'New': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Contacted': 'bg-sky-50 text-sky-700 ring-sky-600/20',
  'Qualified': 'bg-teal-50 text-teal-700 ring-teal-600/20',
  'Nurture': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'Lost': 'bg-red-50 text-red-700 ring-red-600/20',
  'Won': 'bg-green-50 text-green-700 ring-green-600/20',
  // Quotations
  'Draft': 'bg-slate-100 text-slate-700 ring-slate-500/20',
  'Sent': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Approved': 'bg-green-50 text-green-700 ring-green-600/20',
  'Rejected': 'bg-red-50 text-red-700 ring-red-600/20',
  'Expired': 'bg-orange-50 text-orange-700 ring-orange-600/20',
  // Deals
  'Open': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Negotiation': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'Closed Won': 'bg-green-50 text-green-700 ring-green-600/20',
  'Closed Lost': 'bg-red-50 text-red-700 ring-red-600/20',
  // Orders
  'Pending': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'Processing': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Completed': 'bg-green-50 text-green-700 ring-green-600/20',
  'Cancelled': 'bg-red-50 text-red-700 ring-red-600/20',
  // Payments
  'Paid': 'bg-green-50 text-green-700 ring-green-600/20',
  'Overdue': 'bg-red-50 text-red-700 ring-red-600/20',
  // Priorities
  'High': 'bg-red-50 text-red-700 ring-red-600/20',
  'Medium': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'Low': 'bg-slate-100 text-slate-700 ring-slate-500/20',
};

export function statusClass(status) {
  return STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 ring-slate-500/20';
}
