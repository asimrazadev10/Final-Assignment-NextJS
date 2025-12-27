'use client';

import type { Client, Subscription, Workspace } from '../../_lib/types';

type SubscriptionFormState = {
  name: string;
  vendor: string;
  plan: string;
  amount: string;
  currency: string;
  period: string;
  nextRenewalDate: string;
  category: string;
  notes: string;
  tags: string;
  workspaceId: string;
  clientId: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;

  editingItem: Subscription | any | null;

  form: SubscriptionFormState;
  setForm: (v: SubscriptionFormState) => void;

  clients: Client[];
  workspaces: Workspace[];

  onSubmit: (e: React.FormEvent) => void | Promise<void>;
};

export function SubscriptionModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  clients,
  workspaces,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          {editingItem ? 'Edit Subscription' : 'Add Subscription'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                placeholder="Subscription Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Vendor</label>
              <input
                type="text"
                placeholder="Vendor"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Plan</label>
              <input
                type="text"
                placeholder="Plan"
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Currency</label>
              <select
                style={{ colorScheme: 'dark' }}
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="USD" className="bg-gray-900 text-white">USD</option>
                <option value="EUR" className="bg-gray-900 text-white">EUR</option>
                <option value="GBP" className="bg-gray-900 text-white">GBP</option>
                <option value="PKR" className="bg-gray-900 text-white">PKR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Period</label>
              <select
                style={{ colorScheme: 'dark' }}
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              >
                <option value="monthly" className="bg-gray-900 text-white">Monthly</option>
                <option value="yearly" className="bg-gray-900 text-white">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Next Renewal Date</label>
              <input
                type="date"
                value={form.nextRenewalDate}
                onChange={(e) => setForm({ ...form, nextRenewalDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Client (Optional)</label>
              <select
                style={{ colorScheme: 'dark' }}
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="" className="bg-gray-900 text-white">No Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">You can manage clients after creating the subscription</p>
            </div>

            {workspaces.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Workspace</label>
                <select
                  style={{ colorScheme: 'dark' }}
                  value={form.workspaceId}
                  onChange={(e) => setForm({ ...form, workspaceId: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="" className="bg-gray-900 text-white">Use current workspace</option>
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id} className="bg-gray-900 text-white">
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Tags, comma separated"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Notes</label>
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button type="submit" className="flex-1 btn-gradient py-2">
              {editingItem ? 'Update Subscription' : 'Create Subscription'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
