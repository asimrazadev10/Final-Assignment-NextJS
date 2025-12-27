'use client';

import type { Workspace } from '../../_lib/types';

type WorkspaceFormState = {
  name: string;
  monthlyCap: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;

  editingItem: Workspace | any | null;

  form: WorkspaceFormState;
  setForm: (v: WorkspaceFormState) => void;

  onSubmit: (e: React.FormEvent) => void | Promise<void>;
};

export function WorkspaceModal({ isOpen, onClose, editingItem, form, setForm, onSubmit }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">{editingItem ? 'Edit Workspace' : 'Create Workspace'}</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Workspace Name</label>
            <input
              type="text"
              placeholder="Workspace Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              required
            />
          </div>

          {!editingItem && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Monthly Budget (USD)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                placeholder="100"
                value={form.monthlyCap}
                onChange={(e) => setForm({ ...form, monthlyCap: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use default 100</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 btn-gradient py-2">
              {editingItem ? 'Update Workspace' : 'Create Workspace'}
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
