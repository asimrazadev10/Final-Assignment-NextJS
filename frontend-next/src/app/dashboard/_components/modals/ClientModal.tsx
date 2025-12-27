'use client';

import type { Client } from '../../_lib/types';

type ClientFormState = {
  name: string;
  contact: string;
  notes: string;
  workspaceId: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;

  editingItem: Client | any | null;

  form: ClientFormState;
  setForm: (v: ClientFormState) => void;

  onSubmit: (e: React.FormEvent) => void | Promise<void>;
};

export function ClientModal({ isOpen, onClose, editingItem, form, setForm, onSubmit }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">{editingItem ? 'Edit Client' : 'Add Client'}</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Client Name</label>
            <input
              type="text"
              placeholder="Client Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Contact Info</label>
            <input
              type="text"
              placeholder="Contact Info"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Notes</label>
            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 btn-gradient py-2">
              {editingItem ? 'Update Client' : 'Create Client'}
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
