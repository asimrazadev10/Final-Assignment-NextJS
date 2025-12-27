'use client';

import type { Alert, Budget, Subscription } from '../../_lib/types';
import { Bell, DollarSign, Shield } from 'lucide-react';

type Props = {
  alerts: Alert[];
  subscriptions: Subscription[];
  budgets: Budget[];
  currentWorkspaceId?: string | null;
  onTriggerChecks: () => void;
};

export function AlertsTab({
  alerts,
  subscriptions,
  budgets,
  onTriggerChecks,
}: Props) {
  const currentBudget = budgets[0];

  const sorted = [...alerts].sort((a, b) => {
    const daysA = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const daysB = Math.ceil((new Date(b.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysA < 0 && daysB >= 0) return -1;
    if (daysA >= 0 && daysB < 0) return 1;
    if (a.type === 'budget' && b.type !== 'budget') return -1;
    if (a.type !== 'budget' && b.type === 'budget') return 1;
    return daysA - daysB;
  });

  const renderAlert = (alert: Alert) => {
    const subscription = subscriptions.find((s) => s.id === alert.subscriptionId);
    const alertDate = new Date(alert.dueDate);
    const daysUntil = Math.ceil((alertDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntil < 0;
    const isUrgent = daysUntil <= 3 && daysUntil >= 0;

    let title = `${subscription?.name ?? 'Subscription'} Alert`;
    let message = alert.type;
    let color: 'purple' | 'orange' | 'red' = 'purple';
    let icon = Bell;

    if (alert.type === 'budget') {
      title = 'Budget Alert';
      message = 'Budget threshold reached';
      color = 'orange';
      icon = DollarSign;

      // if budget exists, show a better message like in your page [file:1]
      if (currentBudget) {
        title = 'Budget Alert';
        message = `${currentBudget.alertThreshold}% threshold`;
      }
    } else if (alert.type === 'renewal') {
      title = `${subscription?.name ?? 'Subscription'} Renewal`;
      if (isOverdue) {
        message = 'Overdue';
        color = 'red';
      } else if (daysUntil === 0) {
        message = 'Due today';
        color = 'red';
      } else if (daysUntil === 1) {
        message = 'Due tomorrow';
        color = 'red';
      } else {
        message = `${daysUntil} days left`;
        color = isUrgent ? 'orange' : 'purple';
      }
    } else {
      if (isOverdue) color = 'red';
      else if (isUrgent) color = 'orange';
    }

    const container =
      color === 'red'
        ? 'bg-red-500/10 border-red-500/30'
        : color === 'orange'
          ? 'bg-orange-500/10 border-orange-500/30'
          : 'bg-white/5 border-white/10 hover:border-purple-600/30';

    const iconWrap =
      color === 'red'
        ? 'bg-red-500/20'
        : color === 'orange'
          ? 'bg-orange-500/20'
          : 'bg-purple-600/20';

    const iconColor =
      color === 'red'
        ? 'text-red-400'
        : color === 'orange'
          ? 'text-orange-400'
          : 'text-purple-400';

    const badge =
      isOverdue ? 'Overdue' : isUrgent ? 'Urgent' : alert.type === 'budget' ? 'Budget' : 'Upcoming';

    const badgeCls =
      color === 'red'
        ? 'bg-red-500/20 text-red-400 border-red-500/30'
        : color === 'orange'
          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
          : 'bg-purple-600/20 text-purple-400 border-purple-600/30';

    const Icon = icon;

    return (
      <div key={alert.id} className={`p-4 rounded-xl border transition-all ${container}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconWrap}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{title}</p>
              <p className="text-sm text-gray-400 capitalize mt-1 truncate">{message}</p>
              {alert.type === 'renewal' && (
                <p className="text-xs text-gray-500 mt-1">Due: {alertDate.toLocaleDateString()}</p>
              )}
            </div>
          </div>

          <span className={`px-3 py-2 rounded-full text-sm font-semibold border whitespace-nowrap ${badgeCls}`}>
            {badge}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Alerts</h3>
          <p className="text-sm text-gray-400">Subscription renewal and budget alerts</p>
        </div>

        <button onClick={onTriggerChecks} className="btn-gradient px-4 py-2">
          Check for Alerts Now
        </button>
      </div>

      <div className="space-y-4">
        {sorted.map(renderAlert)}

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No alerts yet</h3>
            <p className="text-gray-500 mb-4">Alerts will automatically appear here for</p>
            <ul className="text-gray-400 text-sm space-y-1 mb-4">
              <li>• Budget threshold reached or exceeded</li>
              <li>• Subscription renewals (7, 5, 4, 3, 2, 1 days before)</li>
            </ul>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Tip: create a subscription with a near renewal date to see renewal alerts quickly.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
