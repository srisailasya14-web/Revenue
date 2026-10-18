// Deterministic mock data generator for the Business Performance & Revenue
// Analytics Dashboard. All amounts are in Indian Rupees (INR).
//
// Data relationships:
//   Lead 1──* Quotation
//   Lead 1──* Deal
//   Deal 1──* Order
//   Order 1──* Payment
//
// Dates span the last ~75 days so that "Today", "Last 7 Days", "Last 30 Days"
// and custom ranges all return meaningful, comparable data.

// --- Seeded PRNG (mulberry32) for deterministic output ---------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(20261019);
const rand = (min, max) => min + rnd() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];

// --- Reference dimensions --------------------------------------------------
export const DEPARTMENTS = ['Sales', 'Marketing', 'Finance', 'Operations', 'Support'];

export const USERS = [
  { id: 'u1', name: 'Aarav Sharma', dept: 'Sales' },
  { id: 'u2', name: 'Diya Patel', dept: 'Sales' },
  { id: 'u3', name: 'Vikram Nair', dept: 'Marketing' },
  { id: 'u4', name: 'Ananya Reddy', dept: 'Marketing' },
  { id: 'u5', name: 'Rohan Mehta', dept: 'Finance' },
  { id: 'u6', name: 'Kavya Iyer', dept: 'Operations' },
  { id: 'u7', name: 'Arjun Gupta', dept: 'Support' },
];

export const LEAD_SOURCES = ['Website', 'Referral', 'LinkedIn', 'Email Campaign', 'Cold Call', 'Event'];
export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Nurture', 'Lost', 'Won'];
export const FUNNEL_STAGES = ['MQL', 'SQL', 'Proposal', 'Negotiation', 'Won'];
export const QUOTATION_STATUSES = ['Draft', 'Sent', 'Approved', 'Rejected', 'Expired'];
export const DEAL_STAGES = ['Open', 'Negotiation', 'Closed Won', 'Closed Lost'];
export const ORDER_STATUSES = ['Pending', 'Processing', 'Completed', 'Cancelled'];
export const PAYMENT_STATUSES = ['Paid', 'Pending', 'Overdue'];
export const PAYMENT_METHODS = ['UPI', 'Net Banking', 'Card', 'Cheque', 'RTGS'];
export const PRIORITIES = ['High', 'Medium', 'Low'];

const COMPANY_PREFIXES = ['Apex', 'Nimbus', 'Orbit', 'Zenith', 'Lumina', 'Vertex', 'Pinnacle', 'Cresta', 'Nova', 'Stellar', 'Quanta', 'Horizon', 'Verde', 'Magnus', 'Aether', 'Solace', 'Titan', 'Prism', 'Cascade', 'Ember'];
const COMPANY_SUFFIXES = ['Solutions', 'Technologies', 'Industries', 'Enterprises', 'Systems', 'Labs', 'Group', 'Infotech', 'Services', 'Ventures'];
const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Myra', 'Kavya', 'Anika', 'Navya', 'Riya', 'Isha'];
const LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Nair', 'Reddy', 'Mehta', 'Iyer', 'Gupta', 'Singh', 'Kapoor', 'Joshi', 'Bose', 'Rao', 'Chopra', 'Malhotra'];

const TODAY = new Date();
TODAY.setHours(23, 59, 59, 999);

function daysAgo(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  d.setHours(randInt(9, 18), randInt(0, 59), 0, 0);
  return d;
}

function iso(d) {
  return d.toISOString();
}

// --- Generate Leads --------------------------------------------------------
const LEAD_COUNT = 120;
const leads = [];
for (let i = 0; i < LEAD_COUNT; i++) {
  const user = pick(USERS);
  const company = `${pick(COMPANY_PREFIXES)} ${pick(COMPANY_SUFFIXES)}`;
  const status = pick(LEAD_STATUSES);
  // Funnel stage derived from status
  let stage;
  if (status === 'New') stage = 'MQL';
  else if (status === 'Contacted') stage = 'SQL';
  else if (status === 'Qualified') stage = 'Proposal';
  else if (status === 'Nurture') stage = 'SQL';
  else if (status === 'Won') stage = 'Won';
  else stage = 'Negotiation'; // Lost leads stopped at Negotiation
  const createdAt = daysAgo(randInt(0, 74));
  leads.push({
    id: `L-${1000 + i}`,
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    company,
    source: pick(LEAD_SOURCES),
    status,
    stage,
    department: user.dept,
    ownerId: user.id,
    ownerName: user.name,
    priority: pick(PRIORITIES),
    createdAt: iso(createdAt),
    value: randInt(50, 800) * 1000, // 50k - 8L
  });
}

// --- Generate Quotations (lead -> many quotations) -------------------------
const quotations = [];
let qId = 5000;
for (const lead of leads) {
  // 55% of leads get 1 quotation, 20% get 2, 5% get 3, rest none
  const r = rnd();
  let count = 0;
  if (r < 0.05) count = 3;
  else if (r < 0.25) count = 2;
  else if (r < 0.8) count = 1;
  for (let k = 0; k < count; k++) {
    const created = new Date(new Date(lead.createdAt).getTime() + randInt(1, 20) * 86400000);
    if (created > TODAY) continue;
    // Status loosely tied to lead status
    let status;
    if (lead.status === 'Won') status = pick(['Approved', 'Approved', 'Sent']);
    else if (lead.status === 'Lost') status = pick(['Rejected', 'Expired', 'Sent']);
    else status = pick(QUOTATION_STATUSES);
    quotations.push({
      id: `Q-${qId++}`,
      leadId: lead.id,
      leadName: lead.name,
      company: lead.company,
      amount: lead.value + randInt(-30, 80) * 1000,
      status,
      department: lead.department,
      ownerId: lead.ownerId,
      ownerName: lead.ownerName,
      createdAt: iso(created),
    });
  }
}

// --- Generate Deals (lead -> many deals; link to a quotation when possible) -
const deals = [];
let dId = 7000;
for (const lead of leads) {
  // Won/Qualified/Negotiation leads have deals; some others too
  const r = rnd();
  let count = 0;
  if (lead.status === 'Won') count = r < 0.6 ? 2 : 1;
  else if (lead.stage === 'Negotiation') count = 1;
  else if (lead.stage === 'Proposal') count = r < 0.5 ? 1 : 0;
  else count = r < 0.15 ? 1 : 0;

  const leadQuots = quotations.filter((q) => q.leadId === lead.id);
  for (let k = 0; k < count; k++) {
    const created = new Date(new Date(lead.createdAt).getTime() + randInt(5, 30) * 86400000);
    if (created > TODAY) continue;
    const linkedQuotation = leadQuots[k] || leadQuots[0] || null;
    let stage;
    if (lead.status === 'Won') stage = 'Closed Won';
    else if (lead.status === 'Lost') stage = 'Closed Lost';
    else stage = pick(['Open', 'Negotiation']);
    const closedAt = stage.startsWith('Closed') ? new Date(created.getTime() + randInt(3, 25) * 86400000) : null;
    if (closedAt && closedAt > TODAY) closedAt.setTime(TODAY.getTime() - randInt(0, 5) * 86400000);
    const value = linkedQuotation ? linkedQuotation.amount : lead.value + randInt(0, 100) * 1000;
    deals.push({
      id: `D-${dId++}`,
      leadId: lead.id,
      leadName: lead.name,
      company: lead.company,
      quotationId: linkedQuotation ? linkedQuotation.id : null,
      title: `${lead.company.split(' ')[0]} — ${pick(['Annual License', 'Enterprise Setup', 'Service Package', 'Migration Project', 'Consulting Engagement'])}`,
      value,
      stage,
      department: lead.department,
      ownerId: lead.ownerId,
      ownerName: lead.ownerName,
      priority: lead.priority,
      createdAt: iso(created),
      closedAt: closedAt ? iso(closedAt) : null,
    });
  }
}

// --- Generate Orders (deal -> many orders) ---------------------------------
const orders = [];
let oId = 9000;
const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
const openDeals = deals.filter((d) => d.stage !== 'Closed Lost');
const dealPool = [...wonDeals, ...openDeals.slice(0, Math.floor(openDeals.length * 0.4))];
for (const deal of dealPool) {
  const r = rnd();
  let count = r < 0.5 ? 1 : r < 0.8 ? 2 : 3;
  for (let k = 0; k < count; k++) {
    const created = new Date(new Date(deal.createdAt).getTime() + randInt(2, 20) * 86400000);
    if (created > TODAY) continue;
    const orderValue = Math.round(deal.value / count * rand(0.7, 1.3));
    let status;
    if (deal.stage === 'Closed Won') status = pick(['Completed', 'Completed', 'Processing', 'Pending']);
    else status = pick(['Pending', 'Processing']);
    orders.push({
      id: `O-${oId++}`,
      orderNumber: `ORD-${oId}`,
      dealId: deal.id,
      leadId: deal.leadId,
      company: deal.company,
      amount: orderValue,
      status,
      department: deal.department,
      ownerId: deal.ownerId,
      ownerName: deal.ownerName,
      createdAt: iso(created),
    });
  }
}

// --- Generate Payments (order -> many payments) ----------------------------
const payments = [];
let pId = 30000;
for (const order of orders) {
  // Split into 1-3 installments
  const installments = rnd() < 0.6 ? 1 : rnd() < 0.85 ? 2 : 3;
  const installmentAmount = Math.round(order.amount / installments);
  for (let k = 0; k < installments; k++) {
    const base = new Date(order.createdAt).getTime() + k * randInt(15, 45) * 86400000;
    const date = new Date(base);
    if (date > TODAY) {
      // Future installment — pending or overdue
      const status = rnd() < 0.5 ? 'Pending' : 'Overdue';
      payments.push({
        id: `P-${pId++}`,
        paymentNumber: `PAY-${pId}`,
        orderId: order.id,
        dealId: order.dealId,
        company: order.company,
        amount: installmentAmount,
        status,
        method: pick(PAYMENT_METHODS),
        department: order.department,
        ownerId: order.ownerId,
        ownerName: order.ownerName,
        date: iso(date),
        dueDate: iso(date),
      });
    } else {
      // Past installment — mostly paid, some pending/overdue
      let status;
      const r = rnd();
      if (order.status === 'Completed') status = r < 0.85 ? 'Paid' : r < 0.95 ? 'Pending' : 'Overdue';
      else status = r < 0.5 ? 'Paid' : r < 0.8 ? 'Pending' : 'Overdue';
      payments.push({
        id: `P-${pId++}`,
        paymentNumber: `PAY-${pId}`,
        orderId: order.id,
        dealId: order.dealId,
        company: order.company,
        amount: installmentAmount,
        status,
        method: pick(PAYMENT_METHODS),
        department: order.department,
        ownerId: order.ownerId,
        ownerName: order.ownerName,
        date: iso(date),
        dueDate: iso(date),
      });
    }
  }
}

export const LEADS = leads;
export const QUOTATIONS = quotations;
export const DEALS = deals;
export const ORDERS = orders;
export const PAYMENTS = payments;

// Combined export for convenience
export const DATA = {
  leads,
  quotations,
  deals,
  orders,
  payments,
  users: USERS,
  departments: DEPARTMENTS,
};
