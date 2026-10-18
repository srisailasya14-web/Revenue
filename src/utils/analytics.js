// Analytics layer: derives all dashboard metrics from the raw datasets given
// a filter context { range, prevRange, userId, department }.
import {
  LEADS, QUOTATIONS, DEALS, ORDERS, PAYMENTS,
  LEAD_SOURCES, QUOTATION_STATUSES, DEAL_STAGES, FUNNEL_STAGES,
  ORDER_STATUSES, PAYMENT_STATUSES, PRIORITIES, DEPARTMENTS, USERS,
} from '@/data/mockData';
import { inRange, dayBuckets } from '@/utils/dates';
import { safeDiv, pctChange } from '@/utils/format';

// Apply user/department filter to a row.
function passesUserDept(row, userId, department) {
  if (userId && row.ownerId !== userId) return false;
  if (department && row.department !== department) return false;
  return true;
}

function filterRows(rows, ctx, dateField = 'createdAt') {
  return rows.filter(
    (r) => passesUserDept(r, ctx.userId, ctx.department) && inRange(r[dateField], ctx.range)
  );
}

function filterRowsRange(rows, range, dateField = 'createdAt') {
  return rows.filter((r) => inRange(r[dateField], range));
}

// Sum helper
const sum = (arr, field) => arr.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
const count = (arr) => arr.length;

export function computeMetrics(ctx) {
  const { range, prevRange } = ctx;

  // --- Current-period rows (user/dept filtered) ----------------------------
  const leads = filterRows(LEADS, ctx, 'createdAt');
  const quotations = filterRows(QUOTATIONS, ctx, 'createdAt');
  const deals = filterRows(DEALS, ctx, 'createdAt');
  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const orders = filterRows(ORDERS, ctx, 'createdAt');
  const payments = filterRows(PAYMENTS, ctx, 'date');

  // --- Previous-period rows (same user/dept) -------------------------------
  const prevLeads = filterRowsRange(
    LEADS.filter((r) => passesUserDept(r, ctx.userId, ctx.department)), prevRange, 'createdAt');
  const prevQuotations = filterRowsRange(
    QUOTATIONS.filter((r) => passesUserDept(r, ctx.userId, ctx.department)), prevRange, 'createdAt');
  const prevDeals = filterRowsRange(
    DEALS.filter((r) => passesUserDept(r, ctx.userId, ctx.department)), prevRange, 'createdAt');
  const prevWonDeals = prevDeals.filter((d) => d.stage === 'Closed Won');
  const prevOrders = filterRowsRange(
    ORDERS.filter((r) => passesUserDept(r, ctx.userId, ctx.department)), prevRange, 'createdAt');
  const prevPayments = filterRowsRange(
    PAYMENTS.filter((r) => passesUserDept(r, ctx.userId, ctx.department)), prevRange, 'date');

  // --- KPI values ----------------------------------------------------------
  const totalLeads = count(leads);
  const totalQuotations = count(quotations);
  const quotationValue = sum(quotations, 'amount');
  const totalDeals = count(deals);
  const wonDealCount = count(wonDeals);
  const dealsValue = sum(deals, 'value'); // pipeline value
  const wonRevenue = sum(wonDeals, 'value'); // won revenue
  const ordersCount = count(orders);
  const ordersValue = sum(orders, 'amount');
  const paymentsCollected = sum(payments.filter((p) => p.status === 'Paid'), 'amount');
  const paymentsPending = sum(payments.filter((p) => p.status === 'Pending'), 'amount');
  const paymentsOverdue = sum(payments.filter((p) => p.status === 'Overdue'), 'amount');
  const outstandingRevenue = paymentsPending + paymentsOverdue;

  const winRate = safeDiv(wonDealCount, totalDeals) * 100;
  const prevWinRate = safeDiv(count(prevWonDeals), count(prevDeals)) * 100;

  const conversionRate = safeDiv(wonDealCount, totalLeads) * 100;
  const prevConversionRate = safeDiv(count(prevWonDeals), count(prevLeads)) * 100;

  const collectionRate = safeDiv(paymentsCollected, paymentsCollected + outstandingRevenue) * 100;
  const prevCollectionAmount = sum(prevPayments.filter((p) => p.status === 'Paid'), 'amount');
  const prevOutstanding = sum(prevPayments.filter((p) => p.status === 'Pending'), 'amount') +
    sum(prevPayments.filter((p) => p.status === 'Overdue'), 'amount');
  const prevCollectionRate = safeDiv(prevCollectionAmount, prevCollectionAmount + prevOutstanding) * 100;

  // --- KPI cards array -----------------------------------------------------
  const kpis = [
    { id: 'leads', label: 'Total Leads', value: totalLeads, format: 'number',
      change: pctChange(totalLeads, count(prevLeads)) },
    { id: 'quotations', label: 'Quotations', value: totalQuotations, format: 'number',
      change: pctChange(totalQuotations, count(prevQuotations)) },
    { id: 'quotationValue', label: 'Quotation Value', value: quotationValue, format: 'currency',
      change: pctChange(quotationValue, sum(prevQuotations, 'amount')) },
    { id: 'deals', label: 'Deals', value: totalDeals, format: 'number',
      change: pctChange(totalDeals, count(prevDeals)) },
    { id: 'wonDeals', label: 'Won Deals', value: wonDealCount, format: 'number',
      change: pctChange(wonDealCount, count(prevWonDeals)) },
    { id: 'revenue', label: 'Won Revenue', value: wonRevenue, format: 'currency',
      change: pctChange(wonRevenue, sum(prevWonDeals, 'value')) },
    { id: 'orders', label: 'Orders', value: ordersCount, format: 'number',
      change: pctChange(ordersCount, count(prevOrders)) },
    { id: 'ordersValue', label: 'Order Value', value: ordersValue, format: 'currency',
      change: pctChange(ordersValue, sum(prevOrders, 'amount')) },
    { id: 'collected', label: 'Collected', value: paymentsCollected, format: 'currency',
      change: pctChange(paymentsCollected, prevCollectionAmount) },
    { id: 'outstanding', label: 'Outstanding', value: outstandingRevenue, format: 'currency',
      change: pctChange(outstandingRevenue, prevOutstanding) },
    { id: 'winRate', label: 'Win Rate', value: winRate, format: 'percent',
      change: winRate - prevWinRate, isAbsolute: true },
    { id: 'conversion', label: 'Conversion', value: conversionRate, format: 'percent',
      change: conversionRate - prevConversionRate, isAbsolute: true },
  ];

  // --- Funnel (lead stage counts) ------------------------------------------
  const funnel = FUNNEL_STAGES.map((stage) => ({
    stage,
    count: count(leads.filter((l) => l.stage === stage)),
  }));

  // --- Lead sources --------------------------------------------------------
  const leadSources = LEAD_SOURCES.map((source) => ({
    source,
    count: count(leads.filter((l) => l.source === source)),
    value: sum(leads.filter((l) => l.source === source), 'value'),
  })).sort((a, b) => b.count - a.count);

  // --- Quotation statuses --------------------------------------------------
  const quotationStatuses = QUOTATION_STATUSES.map((status) => ({
    status,
    count: count(quotations.filter((q) => q.status === status)),
    value: sum(quotations.filter((q) => q.status === status), 'amount'),
  }));

  // --- Deal stages ---------------------------------------------------------
  const dealStages = DEAL_STAGES.map((stage) => ({
    stage,
    count: count(deals.filter((d) => d.stage === stage)),
    value: sum(deals.filter((d) => d.stage === stage), 'value'),
  }));

  // --- Priority breakdown --------------------------------------------------
  const priorityBreakdown = PRIORITIES.map((p) => ({
    priority: p,
    count: count(leads.filter((l) => l.priority === p)),
    value: sum(leads.filter((l) => l.priority === p), 'value'),
  }));

  // --- Order statuses ------------------------------------------------------
  const orderStatuses = ORDER_STATUSES.map((s) => ({
    status: s,
    count: count(orders.filter((o) => o.status === s)),
    value: sum(orders.filter((o) => o.status === s), 'amount'),
  }));

  // --- Payment statuses ----------------------------------------------------
  const paymentStatuses = PAYMENT_STATUSES.map((s) => ({
    status: s,
    count: count(payments.filter((p) => p.status === s)),
    value: sum(payments.filter((p) => p.status === s), 'amount'),
  }));

  // --- Payment methods -----------------------------------------------------
  const methodSet = [...new Set(PAYMENTS.map((p) => p.method))];
  const paymentMethods = methodSet.map((m) => ({
    method: m,
    count: count(payments.filter((p) => p.method === m)),
    value: sum(payments.filter((p) => p.method === m && p.status === 'Paid'), 'amount'),
  }));

  // --- Collection trend (paid over time) -----------------------------------
  const buckets = dayBuckets(range, 12);
  const collectionTrend = buckets.map((b) => {
    const inB = (p) => {
      const d = new Date(p.date).getTime();
      return d >= b.start.getTime() && d <= b.end.getTime();
    };
    const paid = payments.filter((p) => p.status === 'Paid' && inB(p));
    return {
      label: b.label,
      collected: sum(paid, 'amount'),
      outstanding: sum(payments.filter((p) => (p.status === 'Pending' || p.status === 'Overdue') && inB(p)), 'amount'),
    };
  });

  // --- Lead trend (new, qualified and converted over time) ------------------
  const leadTrend = buckets.map((b) => {
    const inB = (l) => {
      const t = new Date(l.createdAt).getTime();
      return t >= b.start.getTime() && t <= b.end.getTime();
    };
    return {
      label: b.label,
      newLeads: count(leads.filter(inB)),
      qualified: count(leads.filter((l) => l.status === 'Qualified' && inB(l))),
      won: count(leads.filter((l) => l.status === 'Won' && inB(l))),
    };
  });

  // --- Revenue trend (won deals over time) ---------------------------------
  const revenueTrend = buckets.map((b) => {
    const inB = (d) => {
      if (!d.closedAt) return false;
      const t = new Date(d.closedAt).getTime();
      return t >= b.start.getTime() && t <= b.end.getTime();
    };
    return {
      label: b.label,
      revenue: sum(wonDeals.filter(inB), 'value'),
      pipeline: sum(deals.filter((d) => {
        const t = new Date(d.createdAt).getTime();
        return t >= b.start.getTime() && t <= b.end.getTime();
      }), 'value'),
    };
  });

  // --- Department breakdown ------------------------------------------------
  const departmentBreakdown = DEPARTMENTS.map((dept) => {
    const dl = leads.filter((l) => l.department === dept);
    const dd = deals.filter((d) => d.department === dept);
    const dw = dd.filter((d) => d.stage === 'Closed Won');
    return {
      department: dept,
      leads: count(dl),
      deals: count(dd),
      won: count(dw),
      revenue: sum(dw, 'value'),
    };
  });

  // --- Top performers ------------------------------------------------------
  const performerMap = new Map();
  for (const u of USERS) {
    if (ctx.department && u.dept !== ctx.department) continue;
    if (ctx.userId && u.id !== ctx.userId) continue;
    performerMap.set(u.id, { user: u, leads: 0, deals: 0, won: 0, revenue: 0 });
  }
  for (const l of leads) {
    const p = performerMap.get(l.ownerId);
    if (p) p.leads++;
  }
  for (const d of deals) {
    const p = performerMap.get(d.ownerId);
    if (p) { p.deals++; if (d.stage === 'Closed Won') { p.won++; p.revenue += d.value; } }
  }
  const topPerformers = [...performerMap.values()]
    .map((p) => ({ ...p.user, ...p }))
    .sort((a, b) => b.revenue - a.revenue);

  // --- Outstanding detail (payments pending/overdue) -----------------------
  const outstandingPayments = payments
    .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return {
    kpis,
    raw: { leads, quotations, deals, wonDeals, orders, payments },
    funnel,
    leadSources,
    quotationStatuses,
    dealStages,
    priorityBreakdown,
    orderStatuses,
    paymentStatuses,
    paymentMethods,
    collectionTrend,
    leadTrend,
    revenueTrend,
    departmentBreakdown,
    topPerformers,
    outstandingPayments,
    totals: {
      totalLeads, totalQuotations, quotationValue, totalDeals, wonDealCount,
      dealsValue, wonRevenue, ordersCount, ordersValue,
      paymentsCollected, paymentsPending, paymentsOverdue, outstandingRevenue,
      winRate, conversionRate, collectionRate,
    },
  };
}
