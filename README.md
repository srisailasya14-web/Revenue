# SecureRegent — Business Performance & Revenue Analytics Dashboard

A polished, responsive CRM analytics dashboard built for the Front End Development internship assignment at **SecureRegent Private Limited**.

Built with **React + Vite**, **JavaScript (JSX)**, **Tailwind CSS**, **Recharts**, and **Lucide React**. All data is realistic local dummy data generated in the browser — no backend or database required.

---

## Features

- **12 KPI cards** with previous-period comparison and % change pills
  - Total Leads, Quotations, Quotation Value, Deals, Won Deals, Won Revenue, Orders, Order Value, Collected, Outstanding, Win Rate, Conversion Rate
- **Global date presets**: Today, Last 7 Days, Last 30 Days, Custom Range
- **User and Department filters** applied to every chart, table and KPI
- **Lead funnel** (MQL → SQL → Proposal → Negotiation → Won)
- **Lead sources** bar chart with value
- **Quotation analytics** with status pie + summary tiles
- **Deal & revenue analytics** with stage breakdown and revenue/pipeline trend
- **Priority breakdown** (High / Medium / Low)
- **Orders** with fulfilment status
- **Payments & collection trends** (collected vs outstanding) and payment methods
- **Outstanding revenue** view with pending vs overdue split
- **Clickable drill-down**: click any lead/quotation/deal/order/payment row to open a modal showing the full related chain (lead → quotations → deals → orders → payments)
- **Sortable tables** (click any column header)
- **CSV export** (leads export from top bar; outstanding export from Outstanding view)
- **Empty-data and zero-division safety** throughout
- All currency in **Indian Rupees (₹)** with en-IN formatting (Lakh/Crore compact form on charts)
- Fully **responsive** layout (mobile sidebar, adaptive grids)
- Consistent data relationships: one lead → many quotations & deals; one deal → many orders; one order → many payments. All metrics are calculated from these datasets.

---

## Project structure

```
project/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root: layout, routing, state
│   ├── index.css            # Tailwind + global styles
│   ├── data/
│   │   └── mockData.js      # Deterministic dummy data (leads, quotations, deals, orders, payments, users, departments)
│   ├── utils/
│   │   ├── format.js        # INR formatting, safe division, % change, dates
│   │   ├── dates.js         # Date presets, ranges, buckets
│   │   ├── csv.js           # CSV export helper
│   │   ├── analytics.js     # Computes all metrics from datasets given filters
│   │   └── theme.js         # Chart colors + status badge styles
│   ├── hooks/
│   │   └── useFilters.jsx   # Central filter state (preset, custom range, user, dept)
│   ├── components/
│   │   ├── ui.jsx           # Card, Badge, ChangePill, Empty primitives
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Topbar.jsx       # Filters bar (presets, custom range, user, dept, export)
│   │   ├── KpiGrid.jsx      # KPI cards grid
│   │   ├── Charts.jsx       # All Recharts chart components
│   │   ├── DataTable.jsx    # Reusable sortable table
│   │   └── DrillDownModal.jsx  # Lead drill-down with full related chain
│   └── views/
│       ├── OverviewView.jsx
│       ├── LeadsView.jsx
│       ├── QuotationsView.jsx
│       ├── DealsView.jsx
│       ├── OrdersView.jsx
│       ├── PaymentsView.jsx
│       └── OutstandingView.jsx
```

---

## Prerequisites

- **Node.js 18+** and **npm** — download from https://nodejs.org/
- **VS Code** (recommended) with the ESLint extension (optional)

Verify Node is installed:

```bash
node -v
npm -v
```

---

## Installation & running locally (VS Code terminal)

1. Open the project folder in VS Code.
2. Open the integrated terminal (`Ctrl + ` ` `` or **Terminal → New Terminal**).
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## Testing / verifying the build

Before deploying, confirm the project builds cleanly:

```bash
npm run build
```

This produces a production bundle in the `dist/` folder. Preview it locally:

```bash
npm run preview
```

Open the URL shown (usually `http://localhost:4173`) and click through every section to verify:

- KPI cards render and show period-over-period change pills
- Date presets (Today / 7 Days / 30 Days / Custom Range) update all charts and tables
- User and Department filters narrow every view
- All charts render (funnel, sources, quotations, deals, revenue trend, collection trend, priority, orders, payments, methods, department)
- Tables sort when you click column headers
- Clicking a row opens the drill-down modal with the lead's full chain
- CSV export downloads a file from the top bar and the Outstanding view
- Empty filters (e.g. a user with no data in Today) show a graceful empty state instead of crashing

---

## Free deployment

The build output in `dist/` is static and can be hosted for free on **Netlify** or **Vercel**.

### Option A — Netlify (drag & drop, easiest)

1. Run `npm run build` locally.
2. Go to https://app.netlify.com/drop
3. Drag the entire `dist/` folder onto the page.
4. Netlify gives you a public URL immediately.

For a persistent deployment with continuous deploys:

1. Push the project to a GitHub repository.
2. In Netlify, **Add new site → Import an existing project** and pick the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy**. Netlify provides a public URL (e.g. `https://your-app.netlify.app`).

### Option B — Vercel

1. Push the project to a GitHub repository.
2. Go to https://vercel.com/new and import the repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output directory `dist`.
4. Click **Deploy**. Vercel provides a public URL (e.g. `https://your-app.vercel.app`).

After deploy, open the public URL in an incognito window to confirm the dashboard loads and all interactions work.

---

## Tech notes

- **Vite + React 18** with `@vitejs/plugin-react`.
- **Tailwind CSS 3** with a custom brand palette and 8px spacing.
- **Recharts** for all charts (funnel, bar, pie, area, line).
- **Lucide React** for icons.
- Data is generated deterministically (seeded PRNG) so charts are stable across reloads.
- Previous-period length always equals the selected period length, so % change comparisons are meaningful.
- Zero-division is handled with a `safeDiv` helper returning `0`.
- Indian number formatting via `toLocaleString('en-IN')`; compact form uses Lakh (L) and Crore (Cr).

---

## Author

Front End Development Internship Assignment — SecureRegent Private Limited.
Deadline: 19 October 2026, 11:59 PM.
