import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Transaction,
  Category,
  Budget,
  MonthlySummary,
  FinancialInsight,
  TransactionType,
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from '../lib/initialData';
import { getSupabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { formatINR } from '../lib/formatters';

interface ExpenseContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  isLoading: boolean;
  // Transaction actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => Promise<Transaction>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  // Category actions
  addCategory: (cat: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Budget actions
  setBudget: (budget: Omit<Budget, 'id'>) => Promise<Budget>;
  deleteBudget: (id: string) => Promise<void>;
  // Calculated summaries & insights
  currentMonthSummary: MonthlySummary;
  allMonthsSummaries: Record<string, MonthlySummary>;
  overallBudget: Budget | undefined;
  categoryBudgets: (Category & { budgetAmount?: number; spentAmount: number; percentage: number })[];
  financialInsights: FinancialInsight[];
  // Reset
  resetToSampleData: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();

  // Current month string e.g. "2026-11"
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('navipulse_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('navipulse_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('navipulse_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  // Fetch data from Supabase if authenticated
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || isDemoMode || !user) {
      return;
    }

    const loadCloudData = async () => {
      setIsLoading(true);
      try {
        // Load Categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        if (!catError && catData && catData.length > 0) {
          setCategories(catData);
        } else if (!catError && (!catData || catData.length === 0)) {
          // Seed default categories into Supabase for this user
          const categoriesToInsert = INITIAL_CATEGORIES.map((c) => ({
            id: `${c.id}-${user.id.slice(0, 8)}`,
            user_id: user.id,
            name: c.name,
            type: c.type,
            icon: c.icon,
            color: c.color,
            bg_light: c.bgLight,
            is_custom: false,
          }));
          await supabase.from('categories').insert(categoriesToInsert);
          setCategories(INITIAL_CATEGORIES);
        }

        // Load Transactions
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });
        if (!txError && txData !== null) {
          setTransactions(txData);
        }

        // Load Budgets
        const { data: bgData, error: bgError } = await supabase
          .from('budgets')
          .select('*');
        if (!bgError && bgData && bgData.length > 0) {
          setBudgets(bgData);
        } else if (!bgError && (!bgData || bgData.length === 0)) {
          const defaultOverall = {
            id: `bg-overall-${user.id.slice(0, 8)}`,
            user_id: user.id,
            category_id: null,
            amount: 65000,
            month: selectedMonth,
          };
          await supabase.from('budgets').insert(defaultOverall);
          setBudgets([defaultOverall]);
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCloudData();
  }, [user, isDemoMode]);

  // Sync to local storage for instant offline / guest experience
  useEffect(() => {
    localStorage.setItem('navipulse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('navipulse_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('navipulse_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Transaction CRUD
  const addTransaction = async (
    txData: Omit<Transaction, 'id' | 'created_at'>
  ): Promise<Transaction> => {
    const newId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTx: Transaction = {
      ...txData,
      id: newId,
      user_id: user?.id,
      created_at: new Date().toISOString(),
    };

    // Optimistic state update
    setTransactions((prev) => [newTx, ...prev]);

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('transactions').insert(newTx);
      } catch (err) {
        console.error('Failed to insert transaction into Supabase:', err);
      }
    }

    return newTx;
  };

  const updateTransaction = async (tx: Transaction): Promise<void> => {
    setTransactions((prev) => prev.map((item) => (item.id === tx.id ? tx : item)));

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('transactions').update(tx).eq('id', tx.id);
      } catch (err) {
        console.error('Failed to update transaction in Supabase:', err);
      }
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('transactions').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete transaction from Supabase:', err);
      }
    }
  };

  // Category CRUD
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<Category> => {
    const newId = `cat-custom-${Date.now()}`;
    const newCat: Category = {
      ...catData,
      id: newId,
      is_custom: true,
    };

    setCategories((prev) => [...prev, newCat]);

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('categories').insert({
          ...newCat,
          user_id: user.id,
        });
      } catch (err) {
        console.error('Failed to insert category into Supabase:', err);
      }
    }

    return newCat;
  };

  const updateCategory = async (cat: Category): Promise<void> => {
    setCategories((prev) => prev.map((item) => (item.id === cat.id ? cat : item)));

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('categories').update(cat).eq('id', cat.id);
      } catch (err) {
        console.error('Failed to update category in Supabase:', err);
      }
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    setCategories((prev) => prev.filter((item) => item.id !== id));

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete category from Supabase:', err);
      }
    }
  };

  // Budget CRUD
  const setBudget = async (budgetData: Omit<Budget, 'id'>): Promise<Budget> => {
    // Check if budget exists for this category/month
    const existing = budgets.find(
      (b) => b.category_id === budgetData.category_id && b.month === budgetData.month
    );

    let budgetResult: Budget;
    if (existing) {
      budgetResult = { ...existing, amount: budgetData.amount };
      setBudgets((prev) => prev.map((b) => (b.id === existing.id ? budgetResult : b)));
    } else {
      budgetResult = {
        ...budgetData,
        id: `bg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: user?.id,
        created_at: new Date().toISOString(),
      };
      setBudgets((prev) => [...prev, budgetResult]);
    }

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('budgets').upsert(budgetResult);
      } catch (err) {
        console.error('Failed to set budget in Supabase:', err);
      }
    }

    return budgetResult;
  };

  const deleteBudget = async (id: string): Promise<void> => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));

    const supabase = getSupabase();
    if (supabase && user && !isDemoMode) {
      try {
        await supabase.from('budgets').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete budget in Supabase:', err);
      }
    }
  };

  const resetToSampleData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(INITIAL_CATEGORIES);
    setBudgets(INITIAL_BUDGETS);
    localStorage.setItem('navipulse_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('navipulse_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('navipulse_budgets', JSON.stringify(INITIAL_BUDGETS));
  };

  // Computed Summaries by month
  const allMonthsSummaries = useMemo<Record<string, MonthlySummary>>(() => {
    const summaryMap: Record<string, { income: number; expense: number; catMap: Record<string, number>; days: Set<string> }> = {};

    transactions.forEach((tx) => {
      const monthKey = tx.date.slice(0, 7); // "YYYY-MM"
      if (!summaryMap[monthKey]) {
        summaryMap[monthKey] = { income: 0, expense: 0, catMap: {}, days: new Set() };
      }
      summaryMap[monthKey].days.add(tx.date);

      if (tx.type === 'income') {
        summaryMap[monthKey].income += tx.amount;
      } else {
        summaryMap[monthKey].expense += tx.amount;
        const catName = tx.category_name || 'Other';
        summaryMap[monthKey].catMap[catName] = (summaryMap[monthKey].catMap[catName] || 0) + tx.amount;
      }
    });

    const result: Record<string, MonthlySummary> = {};
    Object.entries(summaryMap).forEach(([month, data]) => {
      const netSavings = data.income - data.expense;
      const savingsRate = data.income > 0 ? (netSavings / data.income) * 100 : 0;
      const daysCount = Math.max(1, data.days.size);
      const dailyAverage = data.expense / daysCount;

      let topCategory: MonthlySummary['topCategory'] = null;
      let highestAmt = 0;
      Object.entries(data.catMap).forEach(([name, amt]) => {
        if (amt > highestAmt) {
          highestAmt = amt;
          topCategory = {
            name,
            amount: amt,
            percentage: data.expense > 0 ? (amt / data.expense) * 100 : 0,
          };
        }
      });

      result[month] = {
        month,
        totalIncome: data.income,
        totalExpense: data.expense,
        netSavings,
        savingsRate,
        dailyAverage,
        topCategory,
      };
    });

    return result;
  }, [transactions]);

  // Current selected month summary
  const currentMonthSummary = useMemo<MonthlySummary>(() => {
    return (
      allMonthsSummaries[selectedMonth] || {
        month: selectedMonth,
        totalIncome: 0,
        totalExpense: 0,
        netSavings: 0,
        savingsRate: 0,
        dailyAverage: 0,
        topCategory: null,
      }
    );
  }, [allMonthsSummaries, selectedMonth]);

  // Overall monthly budget for selected month
  const overallBudget = useMemo(() => {
    return budgets.find((b) => (b.category_id === null || b.category_id === undefined) && b.month === selectedMonth)
      || budgets.find((b) => b.category_id === null || b.category_id === undefined);
  }, [budgets, selectedMonth]);

  // Category wise budgets & spending
  const categoryBudgets = useMemo(() => {
    const monthExpenses = transactions.filter(
      (tx) => tx.type === 'expense' && tx.date.startsWith(selectedMonth)
    );

    const spendMap: Record<string, number> = {};
    monthExpenses.forEach((tx) => {
      spendMap[tx.category_id] = (spendMap[tx.category_id] || 0) + tx.amount;
    });

    return categories
      .filter((cat) => cat.type === 'expense')
      .map((cat) => {
        const catBudget = budgets.find(
          (b) => b.category_id === cat.id && (b.month === selectedMonth || !b.month)
        );
        const budgetAmount = catBudget ? catBudget.amount : undefined;
        const spentAmount = spendMap[cat.id] || 0;
        const percentage = budgetAmount && budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

        return {
          ...cat,
          budgetAmount,
          spentAmount,
          percentage,
        };
      });
  }, [categories, budgets, transactions, selectedMonth]);

  // Algorithmic Financial Insights based on stored real transactions
  const financialInsights = useMemo<FinancialInsight[]>(() => {
    const insights: FinancialInsight[] = [];
    const curSummary = currentMonthSummary;

    // 1. Top spending category insight
    if (curSummary.topCategory && curSummary.topCategory.amount > 0) {
      insights.push({
        id: 'ins-top-cat',
        type: 'info',
        title: `Top Spending Category`,
        description: `Your highest spending category this month is ${curSummary.topCategory.name} at ${formatINR(curSummary.topCategory.amount)} (${curSummary.topCategory.percentage.toFixed(0)}% of total expenses).`,
        metric: `${curSummary.topCategory.percentage.toFixed(0)}%`,
        icon: 'PieChart',
      });
    }

    // 2. Month-over-month comparison insight
    const [yearStr, monthStr] = selectedMonth.split('-');
    const curYear = parseInt(yearStr, 10);
    const curMonth = parseInt(monthStr, 10);
    const prevDate = new Date(curYear, curMonth - 2, 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    const prevSummary = allMonthsSummaries[prevMonthKey];

    if (prevSummary && prevSummary.totalExpense > 0 && curSummary.totalExpense > 0) {
      const diff = curSummary.totalExpense - prevSummary.totalExpense;
      const pctChange = (diff / prevSummary.totalExpense) * 100;

      if (pctChange > 0) {
        insights.push({
          id: 'ins-mom-increase',
          type: 'warning',
          title: `Spending Growth Alert`,
          description: `You spent ${Math.abs(pctChange).toFixed(1)}% more than last month (${formatINR(diff)} difference). Consider trimming non-essential dining or shopping.`,
          metric: `+${pctChange.toFixed(0)}%`,
          icon: 'TrendingUp',
        });
      } else {
        insights.push({
          id: 'ins-mom-decrease',
          type: 'success',
          title: `Spending Discipline`,
          description: `Great job! You spent ${Math.abs(pctChange).toFixed(1)}% less than last month, saving an additional ${formatINR(Math.abs(diff))}.`,
          metric: `-${Math.abs(pctChange).toFixed(0)}%`,
          icon: 'TrendingDown',
        });
      }
    }

    // 3. Net Savings Analysis
    if (curSummary.netSavings > 0) {
      insights.push({
        id: 'ins-savings',
        type: 'success',
        title: `Positive Net Savings`,
        description: `You saved ${formatINR(curSummary.netSavings)} this month with a healthy savings rate of ${curSummary.savingsRate.toFixed(1)}%.`,
        metric: formatINR(curSummary.netSavings),
        icon: 'PiggyBank',
      });
    } else if (curSummary.totalExpense > curSummary.totalIncome && curSummary.totalIncome > 0) {
      insights.push({
        id: 'ins-deficit',
        type: 'warning',
        title: `Expenses Exceed Income`,
        description: `Your expenses exceeded your recorded income by ${formatINR(Math.abs(curSummary.netSavings))}. Review your major outflows.`,
        metric: `-${formatINR(Math.abs(curSummary.netSavings))}`,
        icon: 'AlertTriangle',
      });
    }

    // 4. Budget Overrun Alert
    if (overallBudget && overallBudget.amount > 0) {
      const usage = (curSummary.totalExpense / overallBudget.amount) * 100;
      if (usage >= 100) {
        insights.push({
          id: 'ins-budget-exceeded',
          type: 'warning',
          title: `Monthly Budget Exceeded`,
          description: `You have crossed your set monthly budget of ${formatINR(overallBudget.amount)} by ${formatINR(curSummary.totalExpense - overallBudget.amount)}.`,
          metric: `${usage.toFixed(0)}%`,
          icon: 'AlertCircle',
        });
      } else if (usage >= 80) {
        insights.push({
          id: 'ins-budget-warning',
          type: 'warning',
          title: `Budget Approaching Limit`,
          description: `You have consumed ${usage.toFixed(0)}% of your monthly budget (${formatINR(curSummary.totalExpense)} of ${formatINR(overallBudget.amount)}).`,
          metric: `${usage.toFixed(0)}%`,
          icon: 'ShieldAlert',
        });
      } else {
        insights.push({
          id: 'ins-budget-healthy',
          type: 'success',
          title: `Within Safe Budget Limits`,
          description: `You have ${formatINR(overallBudget.amount - curSummary.totalExpense)} remaining in your total monthly budget.`,
          metric: `${(100 - usage).toFixed(0)}% Left`,
          icon: 'CheckCircle2',
        });
      }
    }

    // 5. Category-specific Budget warnings
    categoryBudgets.forEach((cat) => {
      if (cat.budgetAmount && cat.percentage >= 90) {
        insights.push({
          id: `ins-cat-overrun-${cat.id}`,
          type: 'warning',
          title: `${cat.name} Budget Warning`,
          description: `Spending for ${cat.name} reached ${formatINR(cat.spentAmount)} (${cat.percentage.toFixed(0)}% of ${formatINR(cat.budgetAmount)} budget).`,
          metric: `${cat.percentage.toFixed(0)}%`,
          icon: 'AlertTriangle',
        });
      }
    });

    return insights;
  }, [currentMonthSummary, allMonthsSummaries, selectedMonth, overallBudget, categoryBudgets]);

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        selectedMonth,
        setSelectedMonth,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        setBudget,
        deleteBudget,
        currentMonthSummary,
        allMonthsSummaries,
        overallBudget,
        categoryBudgets,
        financialInsights,
        resetToSampleData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

