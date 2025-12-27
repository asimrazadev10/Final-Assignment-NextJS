'use client';

import type { Workspace } from '../../_lib/types';
import { Building, Edit, Trash2 } from 'lucide-react';

type Props = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;

  onCreate: () => void;
  onSwitch: (ws: Workspace) => void;
  onEdit: (ws: Workspace) => void;
  onDelete: (id: string) => void;
};

export function WorkspacesTab({ workspaces, currentWorkspace, onSwitch, onEdit, onDelete }: Props) {
  return (
    <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Workspaces</h3>
          <p className="text-sm text-gray-400">Manage your workspaces and organizations</p>
        </div>
      </div>

      <div className="space-y-4">
        {workspaces.map((ws) => {
          const isCurrent = currentWorkspace?.id === ws.id;

          return (
            <div
              key={ws.id}
              className={`p-6 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-purple-600/20 border-purple-600/50'
                  : 'bg-white/5 border-white/10 hover:border-purple-600/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCurrent ? 'bg-purple-600/30' : 'bg-gradient-to-br from-purple-600/20 to-pink-600/20'
                    }`}
                  >
                    <Building className="w-6 h-6 text-purple-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-white text-lg truncate">{ws.name}</p>
                      {isCurrent && (
                        <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs font-semibold border border-purple-600/50">
                          Active
                        </span>
                      )}
                    </div>

                    {ws.createdAt && (
                      <p className="text-sm text-gray-400 mt-1">
                        Created {new Date(ws.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!isCurrent && (
                    <button
                      onClick={() => onSwitch(ws)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-purple-500/50 rounded-xl font-semibold text-sm transition-all"
                      title="Switch to this workspace"
                    >
                      Switch
                    </button>
                  )}

                  <button
                    onClick={() => onEdit(ws)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                    title="Edit workspace"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(ws.id)}
                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-gray-400 hover:text-red-400"
                    title="Delete workspace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {workspaces.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No workspaces yet</h3>
            <p className="text-gray-500 mb-4">Create your first workspace to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
