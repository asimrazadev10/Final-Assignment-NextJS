"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "./_components/Sidebar";
import { DashboardHeader } from "./_components/DashboardHeader";

import { DashboardTab } from "./_components/tabs/DashboardTab";
import { WorkspacesTab } from "./_components/tabs/WorkspacesTab";
import { SubscriptionsTab } from "./_components/tabs/SubscriptionsTab";
import { ClientsTab } from "./_components/tabs/ClientsTab";
import { InvoicesTab } from "./_components/tabs/InvoicesTab";
import { AlertsTab } from "./_components/tabs/AlertsTab";
import { BudgetsTab } from "./_components/tabs/BudgetsTab";

import { SubscriptionModal } from "./_components/modals/SubscriptionModal";
import { ClientModal } from "./_components/modals/ClientModal";
import { WorkspaceModal } from "./_components/modals/WorkspaceModal";
import { InvoiceModal } from "./_components/modals/InvoiceModal";
import { ManageClientsModal } from "./_components/modals/ManageClientsModal";

import ConfirmDialog from "@/ui/components/ConfirmDialog";

import { useDashboardData } from "./_hooks/useDashboardData";

import type {
  DashboardTabId,
  Subscription,
  Client,
  Workspace,
  Invoice,
} from "./_lib/types";
import { alertAPI } from "@/lib/api";
import { SettingsTab } from "./_components/tabs/SettingsTab";

export default function DashboardPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTabId>("dashboard");

  // local UI-only state for budgets edit block
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const {
    // data
    user,
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    subscriptions,
    clients,
    invoices,
    alerts,
    budgets,
    subscriptionClients,
    loading,

    // plans
    plans,
    userPlan,
    selectedPlanId,
    selectingPlan,
    selectUserPlan,

    // selection + modal state
    editingItem,
    setEditingItem,
    showSubscriptionForm,
    setShowSubscriptionForm,
    showClientForm,
    setShowClientForm,
    showWorkspaceForm,
    setShowWorkspaceForm,
    showInvoiceForm,
    setShowInvoiceForm,
    showManageClientsModal,
    setShowManageClientsModal,
    selectedSubscriptionForClients,
    setSelectedSubscriptionForClients,

    // forms
    subscriptionForm,
    setSubscriptionForm,
    clientForm,
    setClientForm,
    workspaceForm,
    setWorkspaceForm,
    invoiceForm,
    setInvoiceForm,
    budgetForm,
    setBudgetForm,

    // settings/profile
    profileForm,
    setProfileForm,
    updateProfile,
    passwordForm,
    setPasswordForm,
    showPasswordForm,
    setShowPasswordForm,
    changePassword,

    // actions
    handleLogout,
    quickRenewal,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    createClient,
    updateClient,
    deleteClient,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateBudget,
    fetchClientsForSubscription,
    fetchWorkspaceData,

    // confirm dialog
    confirmDialog,
    setConfirmDialog,

    // derived
    stats,
    spendingData,
    categoryData,
    invoiceImageFile,
    setInvoiceImageFile,
    uploadingImage,
  } = useDashboardData({ router });

  const title = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "workspaces":
        return "Workspace Management";
      case "subscriptions":
        return "Subscriptions Management";
      case "clients":
        return "Client Management";
      case "invoices":
        return "Invoice Management";
      case "alerts":
        return "Alert Center";
      case "budgets":
        return "Budget Management";
      default:
        return "Dashboard";
    }
  }, [activeTab]);

  // --- Edit handlers
  const editSubscription = (sub: Subscription) => {
    setEditingItem(sub);
    setSubscriptionForm({
      name: sub.name ?? "",
      vendor: sub.vendor ?? "",
      plan: sub.plan ?? "",
      amount: String(sub.amount ?? ""),
      currency: sub.currency ?? "USD",
      period: sub.period ?? "monthly",
      nextRenewalDate: sub.nextRenewalDate
        ? new Date(sub.nextRenewalDate).toISOString().split("T")[0]
        : "",
      category: sub.category ?? "",
      notes: sub.notes ?? "",
      tags: (sub.tags ?? []).join(", "),
      workspaceId: sub.workspaceId ?? "",
      clientId: "",
    });
    setShowSubscriptionForm(true);
  };

  const editClient = (c: Client) => {
    setEditingItem(c);
    setClientForm({
      name: c.name ?? "",
      contact: c.contact ?? "",
      notes: c.notes ?? "",
      workspaceId: c.workspaceId ?? "",
    });
    setShowClientForm(true);
  };

  const editWorkspace = (ws: Workspace) => {
    setEditingItem(ws);
    setWorkspaceForm({
      name: ws.name ?? "",
      monthlyCap: ws.monthlyCap != null ? String(ws.monthlyCap) : "",
    });
    setShowWorkspaceForm(true);
  };

  const editInvoice = (inv: Invoice) => {
    setEditingItem(inv);

    // Reset file selection on edit (editing keeps URL; upload is mainly for creating)
    setInvoiceImageFile(null);

    setInvoiceForm({
      subscriptionId: inv.subscriptionId ?? "",
      fileUrl: inv.fileUrl ?? "",
      amount: String(inv.amount ?? ""),
      invoiceDate: inv.invoiceDate
        ? new Date(inv.invoiceDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      status: inv.status ?? "pending",
      source: inv.source ?? "upload",
    });
    setShowInvoiceForm(true);
  };

  const editBudget = () => {
    const b = budgets[0];
    if (!b) return;

    setBudgetForm({
      monthlyCap: String(b.monthlyCap ?? ""),
      alertThreshold: String(b.alertThreshold ?? 80),
    });
    setIsEditingBudget(true);
  };

  const triggerAlertChecks = async () => {
    if (!currentWorkspace?.id) return;
    await alertAPI.triggerChecks();
    setTimeout(async () => {
      await fetchWorkspaceData(currentWorkspace.id);
    }, 1500);
  };

  const handleWorkspaceChange = (id: string) => {
    const ws = workspaces.find((w) => w.id === id) ?? null;
    setCurrentWorkspace(ws);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black overflow-x-hidden pt-16">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onWorkspaceChange={handleWorkspaceChange}
        onLogout={handleLogout}
        alertsCount={alerts.length}
        onCreateWorkspace={() => {
          setEditingItem(null);
          setWorkspaceForm({ name: "", monthlyCap: "" });
          setShowWorkspaceForm(true);
        }}
        onCreateSubscription={() => {
          setEditingItem(null);
          setSubscriptionForm({
            name: "",
            vendor: "",
            plan: "",
            amount: "",
            currency: "USD",
            period: "monthly",
            nextRenewalDate: "",
            category: "",
            notes: "",
            tags: "",
            workspaceId: "",
            clientId: "",
          });
          setShowSubscriptionForm(true);
        }}
        onCreateClient={() => {
          setEditingItem(null);
          setClientForm({ name: "", contact: "", notes: "", workspaceId: "" });
          setShowClientForm(true);
        }}
        onCreateInvoice={() => {
          setEditingItem(null);
          setInvoiceImageFile(null);
          setInvoiceForm({
            subscriptionId: "",
            fileUrl: "",
            amount: "",
            invoiceDate: new Date().toISOString().split("T")[0],
            status: "pending",
            source: "upload",
          });
          setShowInvoiceForm(true);
        }}
      />

      <main className="flex-1 overflow-y-auto">
        <DashboardHeader
          title={title}
          activeTab={activeTab}
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
          onWorkspaceChange={handleWorkspaceChange}
          urgentAlertsCount={stats.urgentAlerts}
          onCreateWorkspace={() => {
            setEditingItem(null);
            setWorkspaceForm({ name: "", monthlyCap: "" });
            setShowWorkspaceForm(true);
          }}
          onCreateSubscription={() => {
            setEditingItem(null);
            setShowSubscriptionForm(true);
          }}
          onCreateClient={() => {
            setEditingItem(null);
            setShowClientForm(true);
          }}
          onCreateInvoice={() => {
            setEditingItem(null);
            setInvoiceImageFile(null);
            setShowInvoiceForm(true);
          }}
        />

        <div className="p-6 space-y-6">
          {activeTab === "dashboard" && (
            <DashboardTab
              stats={stats}
              spendingData={spendingData}
              categoryData={categoryData}
              subscriptions={subscriptions}
              budgets={budgets}
              alerts={alerts}
              onViewAllSubscriptions={() => setActiveTab("subscriptions")}
              onViewAllAlerts={() => setActiveTab("alerts")}
              onAddFirstSubscription={() => setShowSubscriptionForm(true)}
            />
          )}

          {activeTab === "workspaces" && (
            <WorkspacesTab
              workspaces={workspaces}
              currentWorkspace={currentWorkspace}
              onCreate={() => {
                setEditingItem(null);
                setWorkspaceForm({ name: "", monthlyCap: "" });
                setShowWorkspaceForm(true);
              }}
              onEdit={editWorkspace}
              onDelete={deleteWorkspace}
              onSwitch={(ws) => setCurrentWorkspace(ws)}
            />
          )}

          {activeTab === "subscriptions" && (
            <SubscriptionsTab
              subscriptions={subscriptions}
              clients={clients}
              subscriptionClients={subscriptionClients}
              onCreate={() => {
                setEditingItem(null);
                setShowSubscriptionForm(true);
              }}
              onEdit={editSubscription}
              onDelete={deleteSubscription}
              onManageClients={(sub) => {
                setSelectedSubscriptionForClients(sub);
                setShowManageClientsModal(true);
              }}
              onQuickRenewal={quickRenewal}
            />
          )}

          {activeTab === "clients" && (
            <ClientsTab
              clients={clients}
              onAdd={() => {
                setEditingItem(null);
                setShowClientForm(true);
              }}
              onEdit={editClient}
              onDelete={deleteClient}
            />
          )}

          {activeTab === "invoices" && (
            <InvoicesTab
              invoices={invoices}
              subscriptions={subscriptions}
              onAdd={() => {
                setEditingItem(null);
                setInvoiceImageFile(null);
                setShowInvoiceForm(true);
              }}
              onEdit={editInvoice}
              onDelete={deleteInvoice}
            />
          )}

          {activeTab === "alerts" && (
            <AlertsTab
              alerts={alerts}
              subscriptions={subscriptions}
              onTriggerChecks={triggerAlertChecks}
              budgets={budgets}
            />
          )}

          {activeTab === "budgets" && (
            <BudgetsTab
              budgets={budgets}
              budgetForm={budgetForm}
              setBudgetForm={setBudgetForm}
              isEditing={isEditingBudget}
              onEditBudget={editBudget}
              onCancelEdit={() => setIsEditingBudget(false)}
              onSubmitBudget={async (e) => {
                await updateBudget(e);
                setIsEditingBudget(false);
              }}
              budgetUsage={stats.budgetUsage}
              totalMonthlySpend={stats.totalMonthlySpend}
              currentWorkspace={currentWorkspace}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              updateProfile={updateProfile}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              showPasswordForm={showPasswordForm}
              setShowPasswordForm={setShowPasswordForm}
              changePassword={changePassword}
              plans={plans}
              userPlan={userPlan}
              selectedPlanId={selectedPlanId}
              selectingPlan={selectingPlan}
              selectUserPlan={selectUserPlan}
            />
          )}
        </div>

        {/* Modals */}
        <SubscriptionModal
          isOpen={showSubscriptionForm}
          onClose={() => setShowSubscriptionForm(false)}
          editingItem={editingItem}
          form={subscriptionForm}
          setForm={setSubscriptionForm}
          clients={clients}
          workspaces={workspaces}
          onSubmit={editingItem ? updateSubscription : createSubscription}
        />

        <ClientModal
          isOpen={showClientForm}
          onClose={() => setShowClientForm(false)}
          editingItem={editingItem}
          form={clientForm}
          setForm={setClientForm}
          onSubmit={editingItem ? updateClient : createClient}
        />

        <WorkspaceModal
          isOpen={showWorkspaceForm}
          onClose={() => setShowWorkspaceForm(false)}
          editingItem={editingItem}
          form={workspaceForm}
          setForm={setWorkspaceForm}
          onSubmit={editingItem ? updateWorkspace : createWorkspace}
        />

        <InvoiceModal
          isOpen={showInvoiceForm}
          onClose={() => setShowInvoiceForm(false)}
          editingItem={editingItem}
          form={invoiceForm}
          setForm={setInvoiceForm}
          subscriptions={subscriptions}
          onSubmit={editingItem ? updateInvoice : createInvoice}
          invoiceImageFile={invoiceImageFile}
          setInvoiceImageFile={setInvoiceImageFile}
          uploadingImage={uploadingImage}
        />

        <ManageClientsModal
          isOpen={showManageClientsModal}
          onClose={() => {
            setShowManageClientsModal(false);
            setSelectedSubscriptionForClients(null);
          }}
          subscription={selectedSubscriptionForClients}
          clients={clients}
          subscriptionClients={subscriptionClients}
          onRefresh={(subscriptionId) =>
            fetchClientsForSubscription(subscriptionId)
          }
        />

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() =>
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          variant={confirmDialog.variant}
        />
      </main>
    </div>
  );
}
