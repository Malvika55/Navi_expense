import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Check, Sparkles } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { Category, TransactionType } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

const AVAILABLE_ICONS = [
  'UtensilsCrossed',
  'ShoppingBag',
  'Car',
  'Fuel',
  'Receipt',
  'Film',
  'HeartPulse',
  'GraduationCap',
  'Plane',
  'Sparkles',
  'Coffee',
  'Home',
  'Briefcase',
  'Laptop',
  'TrendingUp',
  'Coins',
  'Gift',
  'Smartphone',
  'BookOpen',
  'Dumbbell',
];

const AVAILABLE_COLORS = [
  '#6339F5', // Navi Purple
  '#00B368', // Navi Green
  '#F97316', // Orange
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#EAB308', // Yellow
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#6B7280', // Slate Gray
];

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useExpenses();

  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState('ShoppingBag');
  const [color, setColor] = useState('#6339F5');
  const [error, setError] = useState('');

  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleOpenAddModal = (catType: TransactionType) => {
    setEditingCat(null);
    setName('');
    setType(catType);
    setIcon(catType === 'expense' ? 'ShoppingBag' : 'Briefcase');
    setColor('#6339F5');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setType(cat.type);
    setIcon(cat.icon);
    setColor(cat.color);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a category name.');
      return;
    }

    if (editingCat) {
      await updateCategory({
        ...editingCat,
        name: name.trim(),
        type,
        icon,
        color,
      });
    } else {
      await addCategory({
        name: name.trim(),
        type,
        icon,
        color,
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteCatId) {
      await deleteCategory(deleteCatId);
      setDeleteCatId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs: Expense vs Income */}
      <div className="flex items-center justify-between">
        <div className="flex items-center p-0.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-xs">
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-4 py-1.5 font-bold rounded-xl transition-all ${
              activeTab === 'expense'
                ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Expense Categories ({categories.filter((c) => c.type === 'expense').length})
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-1.5 font-bold rounded-xl transition-all ${
              activeTab === 'income'
                ? 'bg-white dark:bg-[#1a1825] text-navi-green dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Income Categories ({categories.filter((c) => c.type === 'income').length})
          </button>
        </div>

        <button
          onClick={() => handleOpenAddModal(activeTab)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30 transition-all"
        >
          <Plus size={14} />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1a1825] border border-gray-100 dark:border-white/5 shadow-navi-card transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: cat.color }}
              >
                <CategoryIcon iconName={cat.icon} size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  {cat.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-gray-400">
                    {cat.is_custom ? 'Custom' : 'Default'}
                  </span>
                  {cat.is_custom && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Custom Category Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEditModal(cat)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Edit category"
              >
                <Edit2 size={13} />
              </button>

              {cat.is_custom && (
                <button
                  onClick={() => setDeleteCatId(cat.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete custom category"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'Create Custom Category'}
        maxWidth="sm"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pet Care, Subscriptions"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Category Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  type === 'expense'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  type === 'income'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={14} className="text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Select Icon
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                    icon === ic
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <CategoryIcon iconName={ic} size={18} />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-xs font-semibold text-rose-500 text-center">{error}</div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteCatId)}
        onClose={() => setDeleteCatId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this custom category? Existing transactions with this category will retain their history."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

