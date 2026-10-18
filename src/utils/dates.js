// Date presets and range helpers.

export const PRESETS = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'custom', label: 'Custom Range' },
];

// Returns { start, end } as Date objects for a preset, relative to "now".
export function getPresetRange(presetId) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  switch (presetId) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      return { start, end };
    case '7d':
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    case '30d':
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    default:
      return null; // custom handled separately
  }
}

// Previous period of the same length immediately before `range`.
export function getPreviousRange(range) {
  if (!range) return null;
  const lengthMs = range.end.getTime() - range.start.getTime();
  const prevEnd = new Date(range.start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - lengthMs);
  return { start: prevStart, end: prevEnd };
}

export function parseCustomRange(startStr, endStr) {
  if (!startStr || !endStr) return null;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  if (start > end) return null;
  return { start, end };
}

export function inRange(dateStr, range) {
  if (!dateStr || !range) return false;
  const d = new Date(dateStr).getTime();
  return d >= range.start.getTime() && d <= range.end.getTime();
}

export function rangeLabel(range) {
  if (!range) return '—';
  const s = range.start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const e = range.end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${s} – ${e}`;
}

// Split a range into N day buckets for trend charts.
export function dayBuckets(range, maxBuckets = 30) {
  if (!range) return [];
  const dayMs = 86400000;
  const totalDays = Math.floor((range.end - range.start) / dayMs) + 1;
  const buckets = Math.min(totalDays, maxBuckets);
  if (buckets <= 1) {
    return [{ label: range.start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), start: new Date(range.start), end: new Date(range.end) }];
  }
  const spanPerBucket = (range.end.getTime() - range.start.getTime()) / buckets;
  const out = [];
  for (let i = 0; i < buckets; i++) {
    const bStart = new Date(range.start.getTime() + i * spanPerBucket);
    const bEnd = new Date(range.start.getTime() + (i + 1) * spanPerBucket - 1);
    out.push({
      label: bStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      start: bStart,
      end: bEnd,
    });
  }
  return out;
}
