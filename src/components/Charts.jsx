import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend, Funnel, FunnelChart, LabelList,
} from 'recharts';
import { Card, CardHeader, Empty } from '@/components/ui';
import { PALETTE, CHART_COLORS } from '@/utils/theme';
import { formatINR, formatINRCompact, formatNumber } from '@/utils/format';

const tooltipStyle = { fontSize: 12, borderRadius: 10 };

function ChartShell({ title, subtitle, icon, action, children, height = 280 }) {
  return (
    <Card className="h-full">
      <CardHeader title={title} subtitle={subtitle} icon={icon} action={action} />
      <div className="px-2 pb-4" style={{ height }}>
        {children}
      </div>
    </Card>
  );
}

const NoData = () => <div className="h-full flex items-center justify-center"><Empty /></div>;

// --- Lead Funnel ----------------------------------------------------------
export function FunnelChartCard({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Lead Funnel" subtitle="Conversion across pipeline stages" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`${formatNumber(v)} leads`, 'Count']}
            />
            <Funnel
              dataKey="count"
              nameKey="stage"
              data={data}
              isAnimationActive
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
              <LabelList position="right" fill="#0f172a" fontSize={12} stroke="none" dataKey="stage" />
              <LabelList position="center" fill="#fff" fontSize={12} stroke="none" formatter={(v) => formatNumber(v)} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Daily lead trend (line) ----------------------------------------------
export function LeadTrendChart({ data, icon }) {
  const hasData = data && data.some((d) => d.newLeads + d.qualified + d.won > 0);
  return (
    <ChartShell title="Daily Lead Trend" subtitle="New, qualified and converted leads" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${formatNumber(v)} leads`]} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="newLeads" name="New Leads" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="qualified" name="Qualified" stroke={CHART_COLORS.teal} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="won" name="Converted" stroke={CHART_COLORS.amber} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Lead Sources (bar) ---------------------------------------------------
export function LeadSourcesChart({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Lead Sources" subtitle="Volume by acquisition channel" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="source" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }}
              formatter={(v, n) => n === 'count' ? [`${formatNumber(v)} leads`, 'Leads'] : [formatINR(v), 'Value']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} fill={CHART_COLORS.blue} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Quotation statuses (pie) ---------------------------------------------
export function QuotationStatusChart({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Quotation Status" subtitle="Distribution by status" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="40%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n, p) => [`${formatNumber(v)} (${formatINRCompact(p?.payload?.value || 0)})`, p?.payload?.status]} />
            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Deal stages (bar) ----------------------------------------------------
export function DealStageChart({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Deal Stages" subtitle="Count and value by stage" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={formatINRCompact} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }}
              formatter={(v, n) => n === 'value' ? [formatINR(v), 'Value'] : [`${formatNumber(v)} deals`, 'Deals']} />
            <Bar dataKey="count" name="Deals" radius={[6, 6, 0, 0]} fill={CHART_COLORS.sky} />
            <Bar dataKey="value" name="Value" radius={[6, 6, 0, 0]} fill={CHART_COLORS.violet} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Revenue trend (area) -------------------------------------------------
export function RevenueTrendChart({ data, icon }) {
  const hasData = data && data.some((d) => (d.revenue || 0) + (d.pipeline || 0) > 0);
  return (
    <ChartShell title="Revenue & Pipeline Trend" subtitle="Won revenue vs new pipeline" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPipe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={formatINRCompact} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatINR(v)} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="pipeline" name="Pipeline" stroke={CHART_COLORS.blue} fill="url(#gPipe)" strokeWidth={2} />
            <Area type="monotone" dataKey="revenue" name="Won Revenue" stroke={CHART_COLORS.green} fill="url(#gRev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Collection trend (line) ----------------------------------------------
export function CollectionTrendChart({ data, icon }) {
  const hasData = data && data.some((d) => (d.collected || 0) + (d.outstanding || 0) > 0);
  return (
    <ChartShell title="Collection Trend" subtitle="Collected vs outstanding" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={formatINRCompact} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatINR(v)} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="collected" name="Collected" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="outstanding" name="Outstanding" stroke={CHART_COLORS.red} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Priority breakdown (pie) ---------------------------------------------
export function PriorityChart({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Priority Breakdown" subtitle="Leads by priority" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="priority" cx="40%" cy="50%" outerRadius={85} paddingAngle={2}>
              {data.map((entry, i) => (
                <Cell key={i} fill={
                  entry.priority === 'High' ? CHART_COLORS.red :
                  entry.priority === 'Medium' ? CHART_COLORS.amber : CHART_COLORS.slate
                } />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n, p) => [`${formatNumber(v)} leads`, p?.payload?.priority]} />
            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Order statuses (bar) -------------------------------------------------
export function OrderStatusChart({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Order Status" subtitle="Count by fulfillment state" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }}
              formatter={(v, n) => n === 'value' ? [formatINR(v), 'Value'] : [`${formatNumber(v)} orders`, 'Orders']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} fill={CHART_COLORS.teal} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Payment status (pie) + methods (bar) ---------------------------------
export function PaymentStatusChart({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Payment Status" subtitle="Collected / pending / overdue" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="status" cx="40%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
              {data.map((entry, i) => (
                <Cell key={i} fill={
                  entry.status === 'Paid' ? CHART_COLORS.green :
                  entry.status === 'Pending' ? CHART_COLORS.amber : CHART_COLORS.red
                } />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n, p) => [formatINR(v), p?.payload?.status]} />
            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

export function PaymentMethodsChart({ data, icon }) {
  const hasData = data && data.some((d) => d.count > 0);
  return (
    <ChartShell title="Payment Methods" subtitle="Usage by method" icon={icon}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="method" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }} formatter={(v, n) => n === 'value' ? [formatINR(v), 'Paid'] : [`${formatNumber(v)} payments`, 'Payments']} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} fill={CHART_COLORS.violet} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}

// --- Department breakdown --------------------------------------------------
export function DepartmentChart({ data, icon }) {
  const hasData = data && data.some((d) => (d.leads + d.deals) > 0);
  return (
    <ChartShell title="Department Performance" subtitle="Leads, deals & won per dept" icon={icon} height={300}>
      {!hasData ? <NoData /> : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="leads" name="Leads" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
            <Bar dataKey="deals" name="Deals" fill={CHART_COLORS.amber} radius={[4, 4, 0, 0]} />
            <Bar dataKey="won" name="Won" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartShell>
  );
}
