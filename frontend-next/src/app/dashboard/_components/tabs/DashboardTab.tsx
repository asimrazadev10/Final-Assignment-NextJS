"use client";

import type { Alert, Budget, Subscription } from "../../_lib/types";
import {
  formatCurrency,
  getRenewalStatus,
  getStatusColor,
} from "../../_lib/format";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  TrendingDown,
  Users,
} from "lucide-react";

type Props = {
  stats: {
    totalMonthlySpend: number;
    activeSubscriptionsCount: number;
    totalClientsCount: number;
    totalInvoicesCount: number;
    upcomingRenewals: number;
    urgentAlerts: number;
    currentBudget: Budget | undefined;
    budgetUsage: number;
  };
  subscriptions: Subscription[];
  alerts: Alert[];
  budgets: Budget[];
  spendingData: Array<{ month: string; amount: number }>;
  categoryData: Array<{ name: string; value: number; color: string }>;
  onViewAllSubscriptions: () => void;
  onViewAllAlerts: () => void;
  onAddFirstSubscription: () => void;
};

export function DashboardTab({
  stats,
  subscriptions,
  alerts,
  spendingData,
  categoryData,
  onViewAllSubscriptions,
  onViewAllAlerts,
  onAddFirstSubscription,
}: Props) {
  const budgetStatus =
    stats.currentBudget &&
    stats.budgetUsage >= stats.currentBudget.alertThreshold
      ? "warning"
      : "healthy";

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 rounded-2xl p-6 border border-purple-600/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <span
              className={`flex items-center text-sm font-semibold ${
                budgetStatus === "warning" ? "text-red-400" : "text-green-400"
              }`}
            >
              {budgetStatus === "warning" ? (
                <AlertCircle className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.round(stats.budgetUsage)}%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats.totalMonthlySpend, "USD")}
          </h3>
          <p className="text-sm text-gray-400">Monthly Spend</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 rounded-2xl p-6 border border-blue-600/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <span className="flex items-center text-purple-400 text-sm font-semibold">
              <AlertCircle className="w-4 h-4 mr-1" />
              {stats.upcomingRenewals}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats.activeSubscriptionsCount}
          </h3>
          <p className="text-sm text-gray-400">Active Subscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/20 to-green-600/10 rounded-2xl p-6 border border-green-600/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-sm font-semibold text-gray-400">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats.totalClientsCount}
          </h3>
          <p className="text-sm text-gray-400">Total Clients</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/20 to-orange-600/10 rounded-2xl p-6 border border-orange-600/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-400" />
            </div>
            <span className="flex items-center text-green-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {/* keep same “paid count” idea but don’t depend on invoices list here */}
              {/* you can pass paidCount in stats if needed */}
              {""}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats.totalInvoicesCount}
          </h3>
          <p className="text-sm text-gray-400">Total Invoices</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Spending Trend</h3>
              <p className="text-sm text-gray-400">
                Monthly expenditure analysis
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #ffffff20",
                  borderRadius: 12,
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Category Split</h3>
            <p className="text-sm text-gray-400">Spending by category</p>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #ffffff",
                  borderRadius: 12,
                  color: "#8b5cf6",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Recent Subscriptions
              </h3>
              <p className="text-sm text-gray-400">Your active subscriptions</p>
            </div>
            <button
              onClick={onViewAllSubscriptions}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {subscriptions.slice(0, 5).map((sub) => {
              const renewalStatus = getRenewalStatus(sub.nextRenewalDate);
              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/0 hover:border-purple-600/30 transition-all"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {sub.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {sub.vendor} • {sub.plan}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {renewalStatus.text}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">
                      {formatCurrency(sub.amount, sub.currency)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        renewalStatus.status
                      )}`}
                    >
                      {renewalStatus.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {subscriptions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No subscriptions yet</p>
                <button
                  onClick={onAddFirstSubscription}
                  className="text-purple-400 hover:text-purple-300 text-sm mt-2"
                >
                  Add your first subscription
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts (compact) */}
        <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Recent Alerts</h3>
              <p className="text-sm text-gray-400">
                Subscription notifications
              </p>
            </div>
            <button
              onClick={onViewAllAlerts}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border bg-white/5 border-white/10"
              >
                <p className="text-sm font-semibold text-white truncate">
                  {a.type}
                </p>
                <p className="text-xs text-gray-400">
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No alerts yet</p>
                <p className="text-gray-500 text-xs mt-1">
                  Alerts will appear here for renewals and budgets
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
