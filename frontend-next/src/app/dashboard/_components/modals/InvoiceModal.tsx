'use client';

import type { Invoice, Subscription } from '../../_lib/types';

type InvoiceFormState = {
  subscriptionId: string;
  fileUrl: string;
  amount: string;
  invoiceDate: string; // YYYY-MM-DD
  status: string;
  source: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editingItem: Invoice | any | null;

  form: InvoiceFormState;
  setForm: (v: InvoiceFormState) => void;

  subscriptions: Subscription[];
  onSubmit: (e: React.FormEvent) => void | Promise<void>;

  invoiceImageFile: File | null;
  setInvoiceImageFile: (file: File | null) => void;
  uploadingImage: boolean;
};

export function InvoiceModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  subscriptions,
  onSubmit,
  invoiceImageFile,
  setInvoiceImageFile,
  uploadingImage,
}: Props) {
  if (!isOpen) return null;

  const isEditing = !!editingItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900">
        <div className="border-b border-white/10 p-6">
          <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Invoice' : 'Add Invoice'}</h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          {/* Subscription */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Subscription</label>
            <select
              value={form.subscriptionId}
              onChange={(e) => setForm({ ...form, subscriptionId: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
              required
              disabled={isEditing}
            >
              <option value="" className="bg-gray-900 text-white">
                Select Subscription
              </option>
              {subscriptions.map((sub) => (
                <option key={(sub as any).id} value={(sub as any).id} className="bg-gray-900 text-white">
                  {sub.name}
                </option>
              ))}
            </select>

            {isEditing && <p className="mt-1 text-xs text-gray-500">Subscription cannot be changed when editing</p>}
          </div>

          {/* Upload */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Upload invoice image (optional)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              disabled={isEditing || uploadingImage}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setInvoiceImageFile(file);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="truncate text-xs text-gray-500">
                {uploadingImage
                  ? 'Uploading will start when you submit...'
                  : invoiceImageFile
                    ? `Selected: ${invoiceImageFile.name}`
                    : 'No file selected'}
              </p>

              {!isEditing && invoiceImageFile && (
                <button
                  type="button"
                  onClick={() => setInvoiceImageFile(null)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white hover:bg-white/10"
                >
                  Remove
                </button>
              )}
            </div>

            {isEditing && (
              <p className="mt-1 text-xs text-gray-500">
                Upload is disabled while editing. Use the File URL field if you need to change the attachment.
              </p>
            )}
          </div>

          {/* File URL */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">File URL</label>
            <input
              type="text"
              placeholder="File URL"
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500">Tip: leave empty if you uploaded a file above.</p>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Invoice Date</label>
            <input
              type="date"
              value={form.invoiceDate}
              onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
            >
              <option value="pending" className="bg-gray-900 text-white">
                Pending
              </option>
              <option value="paid" className="bg-gray-900 text-white">
                Paid
              </option>
              <option value="overdue" className="bg-gray-900 text-white">
                Overdue
              </option>
              <option value="void" className="bg-gray-900 text-white">
                Void
              </option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
            >
              <option value="email" className="bg-gray-900 text-white">
                Email
              </option>
              <option value="upload" className="bg-gray-900 text-white">
                Upload
              </option>
              <option value="api" className="bg-gray-900 text-white">
                API
              </option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-white/10 pt-4">
            <button
              type="submit"
              disabled={uploadingImage}
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-semibold text-white hover:from-purple-500 hover:to-pink-500 disabled:opacity-60"
            >
              {uploadingImage ? 'Uploading...' : isEditing ? 'Update Invoice' : 'Create Invoice'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
