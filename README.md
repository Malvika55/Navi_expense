# Navi Plus – Personal Expense Tracker & Money Manager

> A modern, mobile-first personal expense-tracking application inspired by the user interface and user experience of the **Navi UPI app**.

---

## 🌟 Key Highlights

- **Navi-Inspired UI/UX**: Clean minimalist aesthetic, deep purple and violet accent colors (`#6339F5`), rounded cards, smooth transitions, and authentic UPI transaction history passbook.
- **Navi UPI Transaction History**:
  - Chronological transaction list grouped by date (**Today**, **Yesterday**, and past dates).
  - Prominent amount styling with vibrant green (`+₹1,500.00`) for income/credits and neutral dark (`-₹485.00`) for expenses.
  - Authentic UPI transaction details receipt sheet with copyable reference ID (`UPI/2026/...`), bank account info, category, and remarks.
  - Search by keyword/merchant, filter by Date Range, Transaction Type, Category, and Payment Method.
  - Sort by Newest, Oldest, Highest, or Lowest.
- **Complete Money Manager**:
  - Dashboard displaying **Total Income**, **Total Expenses**, **Remaining Balance**, **Monthly Savings**, and **Budget Usage %**.
  - **Budget Management**: Set overall monthly limits and category-wise spending targets with real-time warning indicators when approaching or exceeding budgets.
  - **Category Management**: Comprehensive default categories (Food, Groceries, Shopping, Transportation, Fuel, Bills, etc.) plus custom category creator with custom icon and color picker.
  - **Interactive Analytics & Charts**:
    - Donut category breakdown with percentage distribution and hover tooltips.
    - Monthly vs. Yearly Income vs Spending bar chart.
    - Daily & Weekly spending velocity area curves.
  - **Smart Financial Insights**: Algorithmic financial insights computed from real transaction behavior (e.g., top spending categories, month-over-month comparisons, savings rate analysis).
- **Persistent Cloud Storage & Supabase Auth**:
  - Email/Password authentication.
  - PostgreSQL database with **Row Level Security (RLS)** ensuring users only access their own records.
  - In-app Supabase credentials configurator with 1-click SQL migration schema copy.
  - Zero-friction offline/demo fallback pre-loaded with realistic sample UPI transactions.
- **Additional Enhancements**:
  - Dark mode with system preference detection and instant toggle.
  - Export transactions to CSV.
  - Export monthly financial reports (.txt summary).
  - Responsive mobile-first design with toggleable desktop **Navi Mobile Frame** preview.
  - Safe confirmation dialogs before deleting items.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Date Handling**: date-fns
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **Bundler**: Vite

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Cloud Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the SQL migration script from `supabase/schema.sql`.
3. In the app, open **Settings > Configure Supabase** and paste your `Project URL` and `Anon Key`.
4. Register or log in to sync your data securely across all devices.

---

## ⚖️ Disclaimer
*Navi Plus is an independent personal expense tracker and money management tool inspired by modern fintech UI paradigms. It does not connect to live banking networks or execute real financial transactions.*
