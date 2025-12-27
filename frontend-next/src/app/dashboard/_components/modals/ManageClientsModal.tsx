'use client';

import { useMemo, useState } from 'react';
import { X } from 'lucide-react';

import type { Client, Subscription, SubscriptionClientsMap } from '../../_lib/types';
import { showToast } from '@/lib/toast';
import { subscriptionClientAPI } from '@/lib/api';

type Props = {
  isOpen: boolean;
  onClose: () => void;

  subscription: Subscription | null;
  clients: Client[];
  subscriptionClients: SubscriptionClientsMap;

  onRefresh: (subscriptionId: string) => void | Promise<void>;
};

export function ManageClientsModal({
  isOpen,
  onClose,
  subscription,
  clients,
  subscriptionClients,
  onRefresh,
}: Props) {
  const [busy, setBusy] = useState(false);

  const linked = useMemo(() => {
    if (!subscription?.id) return [];
    return subscriptionClients?.[subscription.id] ?? [];
  }, [subscription?.id, subscriptionClients]);

  const linkedIds = useMemo(() => {
    return new Set(
      linked.map((c: any) => (typeof c === 'object' ? c.id : String(c)))
    );
  }, [linked]);

  const availableClients = useMemo(() => {
    return clients.filter((c) => !linkedIds.has(c.id));
  }, [clients, linkedIds]);

  if (!isOpen || !subscription) return null;

  const unlinkClient = async (clientId: string, clientName?: string) => {
    if (!subscription?.id) return;
    setBusy(true);
    try {
      await subscriptionClientAPI.unlinkClient({ subscriptionId: subscription.id, clientId }); // api.js has unlink [file:2]
      await onRefresh(subscription.id);
      showToast.success('Client Unlinked', `${clientName ?? 'Client'} has been removed from this subscription`);
    } catch (err: any) {
      showToast.error('Error Unlinking Client', err?.response?.data?.message ?? err?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  const linkClient = async (clientId: string) => {
    if (!subscription?.id || !clientId) return;
    const client = clients.find((c) => c.id === clientId);

    setBusy(true);
    try {
      await subscriptionClientAPI.linkClient({ subscriptionId: subscription.id, clientId }); // api.js has link [file:2]
      await onRefresh(subscription.id);
      showToast.success('Client Linked', `${client?.name ?? 'Client'} has been linked to this subscription`);
    } catch (err: any) {
      showToast.error('Error Linking Client', err?.response?.data?.message ?? err?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-white/10 flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Manage Clients for {subscription.name}</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-3">Linked Clients</label>

            {linked.length > 0 ? (
              <div className="space-y-2">
                {linked.map((clientObj: any, index: number) => {
                  const client: Client | undefined =
                    typeof clientObj === 'object'
                      ? (clientObj as Client)
                      : clients.find((c) => c.id === String(clientObj));

                  if (!client) return null;

                  return (
                    <div
                      key={client.id ?? index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="text-white font-semibold">{client.name}</p>
                        {client.contact && <p className="text-xs text-gray-400">{client.contact}</p>}
                      </div>

                      <button
                        disabled={busy}
                        onClick={() => unlinkClient(client.id, client.name)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Remove Client"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No clients linked to this subscription</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-3">Add Client</label>

            <select
              style={{ colorScheme: 'dark' }}
              disabled={busy}
              onChange={async (e) => {
                const clientId = e.target.value;
                if (!clientId) return;
                await linkClient(clientId);
                e.currentTarget.value = '';
              }}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="" className="bg-gray-900 text-white">
                Select a client to add
              </option>

              {availableClients.map((c) => (
                <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>

            {availableClients.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">All clients are already linked to this subscription</p>
            )}
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-white/10">
          <button
            disabled={busy}
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
