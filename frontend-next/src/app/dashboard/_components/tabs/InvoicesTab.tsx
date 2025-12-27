'use client';

import type { Invoice, Subscription } from '../../_lib/types';
import { formatCurrency, getStatusColor } from '../../_lib/format';
import { Download, Edit, Eye, Trash2 } from 'lucide-react';

type Props = {
  invoices: Invoice[];
  subscriptions: Subscription[];
  onAdd: () => void;
  onEdit: (inv: Invoice) => void;
  onDelete: (id: string) => void;
};

export function InvoicesTab({ invoices, subscriptions, onEdit, onDelete }: Props) {
  return (
    <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Invoices</h3>
          <p className="text-sm text-gray-400">Track and manage your subscription invoices</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Invoice ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Subscription</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Source</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => {
              const sub = subscriptions.find((s) => s.id === inv.subscriptionId);
              const currency = sub?.currency ?? 'USD';

              return (
                <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm font-mono text-purple-400">INV-{inv.id?.slice(-6) || 'N/A'}</td>
                  <td className="py-4 px-4 text-sm text-white font-semibold">{sub?.name || 'Unknown Subscription'}</td>
                  <td className="py-4 px-4 text-sm text-white font-bold">{formatCurrency(Number(inv.amount || 0), currency)}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(inv.status)}`}>{inv.status}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-400 capitalize">{inv.source}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {inv.fileUrl && (
                        <>
                          <a href={inv.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400" title="View">
                            <Eye className="w-4 h-4" />
                          </a>
                          <a href={inv.fileUrl} download className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-green-400" title="Download">
                            <Download className="w-4 h-4" />
                          </a>
                        </>
                      )}
                      <button onClick={() => onEdit(inv)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(inv.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {invoices.length === 0 && (
              <tr>
                <td className="py-10 text-center text-gray-400" colSpan={7}>
                  No invoices yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
