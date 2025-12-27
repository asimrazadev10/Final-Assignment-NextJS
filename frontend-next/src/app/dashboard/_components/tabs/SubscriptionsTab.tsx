'use client';

import { useMemo, useState } from 'react';

import type { Client, Subscription, SubscriptionClientsMap } from '../../_lib/types';
import { getRenewalStatus, getStatusColor } from '../../_lib/format';

import { CreditCard, Edit, Plus, RefreshCw, Search, Trash2, Users } from 'lucide-react';

type Props = {
  subscriptions: Subscription[];
  clients: Client[]; // kept for compatibility with page.tsx (even if not used here)
  subscriptionClients: SubscriptionClientsMap;

  onCreate: () => void;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onManageClients: (sub: Subscription) => void;

  // NEW (optional): quick renewal action from the hook
  onQuickRenewal?: (sub: Subscription) => void | Promise<void>;
};

function safeClientName(c: any): string {
  if (!c) return '';
  if (typeof c === 'string') return c;
  return String(c?.name ?? '');
}

export function SubscriptionsTab({
  subscriptions,
  subscriptionClients,
  onCreate,
  onEdit,
  onDelete,
  onManageClients,
  onQuickRenewal,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return subscriptions;

    return subscriptions.filter((sub) => {
      const name = String(sub.name ?? '').toLowerCase();
      const vendor = String(sub.vendor ?? '').toLowerCase();
      const plan = String(sub.plan ?? '').toLowerCase();
      const category = String(sub.category ?? '').toLowerCase();
      const notes = String(sub.notes ?? '').toLowerCase();
      const tags = Array.isArray(sub.tags) ? sub.tags.join(', ').toLowerCase() : '';

      return (
        name.includes(q) ||
        vendor.includes(q) ||
        plan.includes(q) ||
        category.includes(q) ||
        notes.includes(q) ||
        tags.includes(q)
      );
    });
  }, [subscriptions, searchTerm]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Subscriptions</h3>
          <p className="text-sm text-gray-400">Manage all your subscription services</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subscriptions..."
              className="w-64 rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-400">
            {subscriptions.length === 0 ? 'No subscriptions yet' : 'No matches'}
          </h3>
          <p className="mb-4 text-gray-500">
            {subscriptions.length === 0
              ? 'Get started by adding your first subscription'
              : 'Try a different search term.'}
          </p>
          {subscriptions.length === 0 && (
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              Add subscription
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const renewalStatus = getRenewalStatus(sub.nextRenewalDate);
            const linked = subscriptionClients[sub.id] ?? [];
            const linkedNames = linked.map(safeClientName).filter(Boolean);

            return (
              <div
                key={sub.id}
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/0 bg-white/5 p-6 transition-all hover:border-purple-600/30 hover:bg-white/10"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                    <CreditCard className="h-8 w-8 text-purple-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="truncate text-lg font-bold text-white">{sub.name}</p>
                      {sub.category ? (
                        <span className="rounded bg-purple-600/20 px-2 py-1 text-xs font-medium text-purple-400">
                          {sub.category}
                        </span>
                      ) : null}
                    </div>

                    <p className="mb-1 text-sm text-gray-400">
                      {sub.vendor} • {sub.plan}
                    </p>

                    {linkedNames.length > 0 ? (
                      <div className="mb-1 flex items-center gap-2">
                        <Users className="h-3 w-3 text-blue-400" />
                        <span className="truncate text-xs text-blue-400">
                          Clients: {linkedNames.join(', ')}
                        </span>
                      </div>
                    ) : null}

                    <p className="text-xs text-gray-500">
                      {renewalStatus.text}
                      {Array.isArray(sub.tags) && sub.tags.length > 0 ? (
                        <span className="ml-2">Tags: {sub.tags.join(', ')}</span>
                      ) : null}
                    </p>

                    {sub.notes ? <p className="mt-2 line-clamp-1 text-xs text-gray-600">{sub.notes}</p> : null}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(
                      renewalStatus.status
                    )}`}
                  >
                    {renewalStatus.status}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {onQuickRenewal ? (
                      <button
                        onClick={() => onQuickRenewal(sub)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-purple-300"
                        title="Quick renewal"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => onManageClients(sub)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-green-400"
                      title="Manage clients"
                    >
                      <Users className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onEdit(sub)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-blue-400"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDelete(sub.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
