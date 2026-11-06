import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PiggyBank,
  PieChart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const SmartInsightsBanner: React.FC = () => {
  const { financialInsights } = useExpenses();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (financialInsights.length === 0) return null;

  const currentInsight = financialInsights[currentIndex % financialInsights.length];

  const getIcon = (type: string, iconName?: string) => {
    if (iconName === 'TrendingUp') return <TrendingUp size={18} className="text-amber-500" />;
    if (iconName === 'TrendingDown') return <TrendingDown size={18} className="text-emerald-500" />;
    if (iconName === 'PiggyBank') return <PiggyBank size={18} className="text-emerald-500" />;
    if (iconName === 'PieChart') return <PieChart size={18} className="text-brand-500" />;
    if (type === 'warning') return <AlertTriangle size={18} className="text-rose-500" />;
    return <Sparkles size={18} className="text-brand-500" />;
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40';
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40';
      default:
        return 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border-brand-100 dark:border-brand-900/40';
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % financialInsights.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + financialInsights.length) % financialInsights.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-50/60 via-purple-50/40 to-indigo-50/60 dark:from-brand-950/20 dark:via-[#1a1825] dark:to-indigo-950/20 p-4 sm:p-5 border border-brand-100 dark:border-white/5 my-5 shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-9 h-9 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
            {getIcon(currentInsight.type, currentInsight.icon)}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Smart Financial Insight
              </span>
              {currentInsight.metric && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border ${getBadgeStyle(
                    currentInsight.type
                  )}`}
                >
                  {currentInsight.metric}
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {currentInsight.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
              {currentInsight.description}
            </p>
          </div>
        </div>

        {/* Carousel controls */}
        {financialInsights.length > 1 && (
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <button
              onClick={handlePrev}
              aria-label="Previous insight"
              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-white/60 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-bold text-gray-400 px-0.5">
              {currentIndex + 1}/{financialInsights.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next insight"
              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-white/60 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

