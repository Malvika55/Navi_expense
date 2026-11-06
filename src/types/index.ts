export type TransactionType = 'expense' | 'income';

export type PaymentMethod =
  | 'UPI'
  | 'Bank Transfer'
  | 'Debit Card'
  | 'Credit Card'
  | 'Cash'
  | 'Net Banking'
  | 'Other';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  bgLight?: string;
  is_custom?: boolean;
  monthly_budget?: number;
}

export interface Transaction {
  id: string;
  user_id?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  category_name?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  payment_method: PaymentMethod;
  bank_name?: string;
  notes?: string;
  reference_id?: string; // UPI Ref ID
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  created_at?: string;
}

export interface Budget {
  id: string;
  user_id?: string;
  category_id?: string | null; // null for total overall monthly budget
  category_name?: string;
  amount: number;
  month: string; // YYYY-MM
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  upi_id?: string;
  phone_number?: string;
  monthly_budget_target?: number;
}

export interface FinancialInsight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'trend';
  title: string;
  description: string;
  metric?: string;
  icon?: string;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number; // percentage
  dailyAverage: number;
  topCategory: {
    name: string;
    amount: number;
    percentage: number;
  } | null;
}

