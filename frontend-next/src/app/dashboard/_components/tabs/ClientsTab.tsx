'use client';

import type { Client } from '../../_lib/types';
import { Edit, Trash2, Users } from 'lucide-react';

type Props = {
  clients: Client[];
  onAdd: () => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
};

export function ClientsTab({ clients, onEdit, onDelete }: Props) {
  return (
    <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Clients</h3>
          <p className="text-sm text-gray-400">Manage your clients and cost allocations</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/0 hover:border-purple-600/30 transition-all group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{client.name}</p>
                <p className="text-sm text-gray-400">Client</p>
              </div>
            </div>

            {client.contact && (
              <p className="text-sm text-gray-400 mb-2 truncate">{client.contact}</p>
            )}

            {client.notes && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{client.notes}</p>
            )}

            <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(client)}
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(client.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {clients.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No clients yet</h3>
            <p className="text-gray-500 mb-4">Add clients to allocate subscription costs</p>
          </div>
        )}
      </div>
    </div>
  );
}
