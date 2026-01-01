"use client";

import type { DashboardTabId, Workspace } from "../_lib/types";
import { Bell, Building, Plus } from "lucide-react";

type Props = {
  title: string;
  activeTab: DashboardTabId;

  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  onWorkspaceChange: (id: string) => void;

  urgentAlertsCount: number;

  onCreateWorkspace: () => void;
  onCreateSubscription: () => void;
  onCreateClient: () => void;
  onCreateInvoice: () => void;
};

export function DashboardHeader({
  title,
  activeTab,
  workspaces,
  currentWorkspace,
  onWorkspaceChange,
  urgentAlertsCount,
  onCreateWorkspace,
  onCreateSubscription,
  onCreateClient,
  onCreateInvoice,
}: Props) {
  const subtitle = (() => {
    switch (activeTab) {
      case "dashboard":
        return "Complete overview of your subscription ecosystem";
      case "workspaces":
        return "Manage your workspaces and organizations";
      case "subscriptions":
        return "Manage all your subscription services";
      case "clients":
        return "Handle client relationships and allocations";
      case "invoices":
        return "Track and manage all invoices";
      case "alerts":
        return "Monitor and manage subscription alerts";
      case "budgets":
        return "Set and monitor spending limits";
      case "settings":
        return "Manage your account, password, and plan";
      default:
        return "";
    }
  })();

  return (
    <header className="h-20 bg-black/50 border-b border-white/10 sticky top-5 z-10 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          {workspaces.length > 0 && (
            <select
              value={currentWorkspace?.id ?? ""}
              onChange={(e) => onWorkspaceChange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              style={{ colorScheme: "dark" }}
            >
              {workspaces.map((ws) => (
                <option
                  key={ws.id}
                  value={ws.id}
                  className="bg-gray-900 text-white"
                >
                  {ws.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onCreateWorkspace}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            title="Create Workspace"
          >
            <Building className="w-5 h-5 text-gray-400" />
          </button>

          <button
            className="relative p-2 hover:bg-white/5 rounded-xl transition-colors"
            title="Alerts"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {urgentAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {activeTab === "subscriptions" && (
            <button
              onClick={onCreateSubscription}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subscription</span>
            </button>
          )}

          {activeTab === "clients" && (
            <button
              onClick={onCreateClient}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          )}

          {activeTab === "invoices" && (
            <button
              onClick={onCreateInvoice}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Invoice</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
