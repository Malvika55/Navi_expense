import React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PiggyBank,
  PieChart,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const FinancialInsightsList: React.FC = () => {
  const { financialInsights, currentMonthSummary } = useExpenses();

  const getIcon = (type: string, iconName?: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp size={20} className="text-amber-500" />;
      case 'TrendingDown':
        return <TrendingDown size={20} className="text-emerald-500" />;
      case 'PiggyBank':
        return <PiggyBank size={20} className="text-emerald-500" />;
      case 'PieChart':
        return <PieChart size={20} className="text-brand-500" />;
      case 'ShieldAlert':
        return <ShieldAlert size={20} className="text-amber-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 size={20} className="text-emerald-500" />;
      default:
        return type === 'warning' ? (
          <AlertTriangle size={20} className="text-rose-500" />
        ) : (
          <Sparkles size={20} className="text-brand-500" />
        );
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-rose-100 dark:border-rose-900/30 bg-rose-50/40 dark:bg-rose-950/20';
      case 'success':
        return 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/20';
      default:
        return 'border-brand-100 dark:border-brand-900/30 bg-brand-50/40 dark:bg-brand-950/20';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Automated Financial Intelligence
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Generated automatically from your real transaction behavior
        </p>
      </div>

      {financialInsights.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-navi-card text-center text-xs text-gray-400">
          Record more transactions to unlock smart financial behavioral insights.
        </div>
      ) : (
        <div className="space-y-3">
          {financialInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-2xl border shadow-sm flex items-start gap-3.5 transition-all ${getCardStyle(
                insight.type
              )}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
                {getIcon(insight.type, insight.icon)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  {insight.metric && (
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-2xs">
                      {insight.metric}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

