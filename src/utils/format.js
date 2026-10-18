// Formatting and safe-math helpers.

export function safeDiv(num, den) {
  if (!den || !isFinite(den) || den === 0) return 0;
  return num / den;
}

export function pctChange(current, previous) {
  if (!previous || previous === 0) {
    if (!current || current === 0) return 0;
    return 100; // grew from zero -> treat as +100%
  }
  return ((current - previous) / previous) * 100;
}

// Full INR currency, e.g. ₹1,23,456
export function formatINR(amount, { decimals = 0 } = {}) {
  const n = Number(amount || 0);
  return '₹' + n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Compact INR for chart axes / KPIs, e.g. ₹1.2L, ₹3.4Cr
export function formatINRCompact(amount) {
  const n = Number(amount || 0);
  const abs = Math.abs(n);
  if (abs >= 10000000) return '₹' + (n / 10000000).toFixed(2).replace(/\.00$/, '') + 'Cr';
  if (abs >= 100000) return '₹' + (n / 100000).toFixed(2).replace(/\.00$/, '') + 'L';
  if (abs >= 1000) return '₹' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '₹' + n.toLocaleString('en-IN');
}

export function formatNumber(n) {
  return Number(n || 0).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
