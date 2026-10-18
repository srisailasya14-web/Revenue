import { useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import DrillDownModal from '@/components/DrillDownModal';
import OverviewView from '@/views/OverviewView';
import LeadsView from '@/views/LeadsView';
import QuotationsView from '@/views/QuotationsView';
import DealsView from '@/views/DealsView';
import OrdersView from '@/views/OrdersView';
import PaymentsView from '@/views/PaymentsView';
import OutstandingView from '@/views/OutstandingView';
import { useFilters } from '@/hooks/useFilters';
import { computeMetrics } from '@/utils/analytics';
import { exportToCSV } from '@/utils/csv';

export default function App() {
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drillLead, setDrillLead] = useState(null);
  const filters = useFilters();

  const metrics = useMemo(
    () => computeMetrics({
      range: filters.range,
      prevRange: filters.prevRange,
      userId: filters.userId,
      department: filters.department,
    }),
    [filters.range, filters.prevRange, filters.userId, filters.department]
  );

  const handleExport = () => {
    const r = metrics.raw;
    // Export a consolidated CSV of leads in the current filtered period
    exportToCSV('dashboard-leads.csv', r.leads, [
      { key: 'id', label: 'Lead ID' },
      { key: 'name', label: 'Name' },
      { key: 'company', label: 'Company' },
      { key: 'source', label: 'Source' },
      { key: 'status', label: 'Status' },
      { key: 'stage', label: 'Stage' },
      { key: 'priority', label: 'Priority' },
      { key: 'ownerName', label: 'Owner' },
      { key: 'department', label: 'Department' },
      { key: 'value', label: 'Value (INR)' },
      { key: 'createdAt', label: 'Created At' },
    ]);
  };

  const renderView = () => {
    switch (active) {
      case 'leads': return <LeadsView metrics={metrics} onLeadClick={setDrillLead} />;
      case 'quotations': return <QuotationsView metrics={metrics} onLeadClick={setDrillLead} />;
      case 'deals': return <DealsView metrics={metrics} onLeadClick={setDrillLead} />;
      case 'orders': return <OrdersView metrics={metrics} onLeadClick={setDrillLead} />;
      case 'payments': return <PaymentsView metrics={metrics} onLeadClick={setDrillLead} />;
      case 'outstanding': return <OutstandingView metrics={metrics} onLeadClick={setDrillLead} filters={filters} />;
      default: return <OverviewView metrics={metrics} onLeadClick={setDrillLead} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        active={active}
        onSelect={setActive}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          filters={filters}
          onMenu={() => setSidebarOpen(true)}
          onExport={handleExport}
          exportLabel="Export Leads"
        />
        <main className="flex-1 px-4 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
          {renderView()}
        </main>
        <footer className="px-4 lg:px-8 py-4 text-center text-xs text-slate-400 border-t border-slate-200">
          SecureRegent Business Performance & Revenue Analytics · Internship Assignment · {new Date().getFullYear()}
        </footer>
      </div>

      {drillLead && <DrillDownModal lead={drillLead} onClose={() => setDrillLead(null)} />}
    </div>
  );
}
