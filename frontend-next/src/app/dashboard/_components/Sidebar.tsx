'use client';

import type { DashboardTabId, User, Workspace } from '../_lib/types';

import {
  Bell,
  Building,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react';

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  activeTab: DashboardTabId;
  setActiveTab: (t: DashboardTabId) => void;

  user: User | null;

  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  onWorkspaceChange: (workspaceId: string) => void;

  alertsCount: number;

  onLogout: () => void;

  onCreateWorkspace: () => void;
  onCreateSubscription: () => void;
  onCreateClient: () => void;
  onCreateInvoice: () => void;
};

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  user,
  workspaces,
  currentWorkspace,
  onWorkspaceChange,
  alertsCount,
  onLogout,
  onCreateWorkspace,
  onCreateSubscription,
  onCreateClient,
  onCreateInvoice,
}: Props) {
  const menuItems: Array<{
    id: DashboardTabId;
    label: string;
    icon: any;
    badge?: number | null;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'workspaces', label: 'Workspaces', icon: Building, badge: workspaces.length },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: null },
    { id: 'clients', label: 'Clients', icon: Users, badge: null },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: null },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alertsCount },
    { id: 'budgets', label: 'Budgets', icon: Shield, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed left-0 top-16 z-40 h-100% border-r border-white/10 bg-gradient-to-b from-black to-purple-900/5 backdrop-blur-xl transition-all duration-300',
          sidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0',
          'lg:sticky lg:top-16 lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          {/* Top */}
          <div className="flex h-25 items-center justify-between border-b border-white/10 p-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 shadow-lg shadow-purple-600/50 transition-transform hover:scale-105"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>

            {sidebarOpen && (
              <button
                onClick={onCreateWorkspace}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                title="Create Workspace"
              >
                + Workspace
              </button>
            )}
          </div>

          {/* Workspace selector */}
          {sidebarOpen && (
            <div className="space-y-3 border-b border-white/10 p-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Workspace</label>
                <select
                  value={currentWorkspace?.id ?? ''}
                  onChange={(e) => onWorkspaceChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  disabled={workspaces.length === 0}
                >
                  {workspaces.length === 0 ? (
                    <option value="" className="bg-gray-900 text-white">
                      No workspaces
                    </option>
                  ) : null}

                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id} className="bg-gray-900 text-white">
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onCreateSubscription}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  + Subscription
                </button>
                <button
                  onClick={onCreateClient}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  + Client
                </button>
                <button
                  onClick={onCreateInvoice}
                  className="col-span-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  + Invoice
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4 [scrollbar-gutter:stable]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={[
                    'group flex w-full items-center justify-between rounded-xl pl-1.5 py-3 transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen ? <span className="whitespace-nowrap text-sm font-medium">{item.label}</span> : null}
                  </div>

                  {sidebarOpen && item.badge != null ? (
                    <span
                      className={[
                        'rounded-full px-2 py-1 text-xs font-bold',
                        isActive ? 'bg-white/20 text-white' : 'bg-purple-600/30 text-purple-300',
                      ].join(' ')}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Bottom user + logout */}
          <div className="space-y-2 border-t border-white/10 p-4">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white">
                  {(user?.name?.[0] ?? user?.username?.[0] ?? 'U').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{user?.name ?? user?.username ?? 'User'}</p>
                  <p className="truncate text-xs text-gray-400">{user?.email ?? ''}</p>
                </div>
              </div>
            ) : null}

            <button
              onClick={onLogout}
              className="group flex w-full items-center gap-3 rounded-xl border border-red-500/20 bg-red-900/20 px-4 py-3 transition-all hover:border-red-500/40 hover:bg-red-900/30"
            >
              <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-300" />
              {sidebarOpen ? <span className="text-sm font-medium text-red-400 group-hover:text-red-300">Logout</span> : null}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}