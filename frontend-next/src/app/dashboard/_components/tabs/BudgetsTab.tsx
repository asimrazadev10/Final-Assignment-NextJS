'use client';

import type { Budget, Workspace } from '../../_lib/types';
import { formatCurrency } from '../../_lib/format';
import { Edit, Shield } from 'lucide-react';

type Props = {
  budgets: Budget[];
  currentWorkspace: Workspace | null;

  totalMonthlySpend: number; 
  budgetUsage: number;       
  onEditBudget: () => void; 

  budgetForm: { monthlyCap: string; alertThreshold: string };
  setBudgetForm: (v: { monthlyCap: string; alertThreshold: string }) => void;
  onSubmitBudget: (e: React.FormEvent) => void | Promise<void>;
  onCancelEdit: () => void;
  isEditing: boolean;
};

export function BudgetsTab({
  budgets,
  currentWorkspace,
  totalMonthlySpend,
  budgetUsage,
  onEditBudget,
  budgetForm,
  setBudgetForm,
  onSubmitBudget,
  onCancelEdit,
  isEditing,
}: Props) {
  return (
    <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Budgets</h3>
          <p className="text-sm text-gray-400">Set and monitor your spending limits</p>
        </div>

        {budgets[0] && (
          <button
            onClick={onEditBudget}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-purple-500/50 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Budget</span>
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const alertValue = Math.round((Number(budget.monthlyCap) || 0) * (Number(budget.alertThreshold) || 0) / 100);
          const over = totalMonthlySpend - Number(budget.monthlyCap || 0);

          return (
            <div
              key={budget.id}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/0 hover:border-purple-600/30 transition-all"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Monthly Budget</p>
                  <p className="text-sm text-gray-400">Workspace: {currentWorkspace?.name}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Monthly Cap</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(Number(budget.monthlyCap || 0), 'USD')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Alert Threshold</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">{Number(budget.alertThreshold || 0)}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when spending reaches {formatCurrency(alertValue, 'USD')}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Current Spending</span>
                    <span>
                      {formatCurrency(totalMonthlySpend, 'USD')} / {formatCurrency(Number(budget.monthlyCap || 0), 'USD')}
                    </span>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        budgetUsage >= (Number(budget.alertThreshold) || 80)
                          ? 'bg-gradient-to-r from-red-600 to-pink-600'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, budgetUsage || 0)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{Math.round(budgetUsage || 0)}% used</span>
                    <span className={over > 0 ? 'text-red-400' : ''}>
                      {over > 0
                        ? `Over budget by ${formatCurrency(over, 'USD')}`
                        : `${formatCurrency(Number(budget.monthlyCap || 0) - totalMonthlySpend, 'USD')} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No budget set</h3>
            <p className="text-gray-500 mb-4">Budgets are automatically created with workspaces</p>
          </div>
        )}

        {/* Update Budget block (shown when editing) */}
        {budgets[0] && isEditing && (
          <div className="col-span-2 bg-white/5 rounded-xl p-6 border border-purple-600/30">
            <h4 className="text-lg font-bold text-white mb-4">Update Budget</h4>
            <form onSubmit={onSubmitBudget} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Cap</label>
                <input
                  type="number"
                  value={budgetForm.monthlyCap}
                  onChange={(e) => setBudgetForm({ ...budgetForm, monthlyCap: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Alert Threshold</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={budgetForm.alertThreshold}
                  onChange={(e) => setBudgetForm({ ...budgetForm, alertThreshold: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn-gradient py-2">
                  Update Budget
                </button>
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
