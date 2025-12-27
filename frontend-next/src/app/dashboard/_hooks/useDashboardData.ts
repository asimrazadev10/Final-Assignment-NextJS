'use client';

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import { useSearchParams } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import {
  alertAPI,
  budgetAPI,
  clientAPI,
  invoiceAPI,
  planAPI,
  subscriptionAPI,
  subscriptionClientAPI,
  uploadAPI,
  userAPI,
  userPlanAPI,
  workspaceAPI,
} from '@/lib/api';

import { showToast } from '@/lib/toast';

import type {
  Alert,
  Budget,
  Client,
  Invoice,
  Subscription,
  SubscriptionClientsMap,
  User,
  Workspace,
} from '../_lib/types';

type ConfirmDialogState = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  variant: 'danger' | 'warning' | 'info';
  onConfirm: (() => Promise<void>) | (() => void);
};

type UseDashboardDataArgs = { router: AppRouterInstance };

type EditingItem = Subscription | Client | Workspace | Invoice | Budget | null;

type Plan = any;
type UserPlan = any;

function toId<T extends Record<string, any>>(doc: T): T & { id: string } {
  const id = String(doc?._id ?? doc?.id ?? '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = doc as any;
  return { ...(rest as any), id };
}

function refId(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return String(val?._id ?? val?.id ?? '');
}

function toMonthlyEquivalent(sub: Subscription): number {
  const amount = Number((sub as any)?.amount) || 0;
  const period = String((sub as any)?.period ?? 'monthly').toLowerCase();

  if (period === 'yearly') return amount / 12;
  if (period === 'quarterly') return amount / 3;

  return amount; // monthly default
}

export function useDashboardData({ router }: UseDashboardDataArgs) {
  const searchParams = useSearchParams();

  // --------------------------
  // Core data
  // --------------------------
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [subscriptionClients, setSubscriptionClients] = useState<SubscriptionClientsMap>({});

  const [loading, setLoading] = useState(true);

  // --------------------------
  // UI state
  // --------------------------
  const [editingItem, setEditingItem] = useState<EditingItem>(null);

  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const [showManageClientsModal, setShowManageClientsModal] = useState(false);
  const [selectedSubscriptionForClients, setSelectedSubscriptionForClients] = useState<Subscription | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    variant: 'danger',
    onConfirm: () => {},
  });

  // --------------------------
  // Forms
  // --------------------------
  const [subscriptionForm, setSubscriptionForm] = useState({
    name: '',
    vendor: '',
    plan: '',
    amount: '',
    currency: 'USD',
    period: 'monthly',
    nextRenewalDate: '',
    category: '',
    notes: '',
    tags: '',
    workspaceId: '',
    clientId: '',
  });

  const [clientForm, setClientForm] = useState({
    name: '',
    contact: '',
    notes: '',
    workspaceId: '',
  });

  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    monthlyCap: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    subscriptionId: '',
    fileUrl: '',
    amount: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    source: 'upload',
  });

  const [budgetForm, setBudgetForm] = useState({
    monthlyCap: '',
    alertThreshold: '80',
  });

  // --------------------------
  // Dashboard extras (React parity)
  // --------------------------
  const [spendingPeriod, setSpendingPeriod] = useState<'6M' | '1Y'>('6M');

  // Invoice upload
  const [invoiceImageFile, setInvoiceImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Settings/Profile
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    email: '',
    companyName: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Plans
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectingPlan, setSelectingPlan] = useState(false);

  // --------------------------
  // Auth / user
  // --------------------------
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('token');
      window.dispatchEvent(new Event('authChanged'));
    }
    showToast.success('Logged Out', 'You have been successfully logged out.');
    setTimeout(() => router.push('/login'), 500);
  };

  const fetchUserData = async () => {
    try {
      const res = await userAPI.getMe();
      const u = res.data as any;
      const normalized = u?._id ? toId(u) : u;
      setUser(normalized);

      setProfileForm({
        name: normalized?.name ?? '',
        username: normalized?.username ?? '',
        email: normalized?.email ?? '',
        companyName: normalized?.companyName ?? '',
      });
    } catch (err: any) {
      if (err?.response?.status === 401) handleLogout();
    }
  };

  const updateProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await userAPI.update(profileForm as any);
      if ((res.data as any)?.status === 201) {
        showToast.success('Profile Updated', 'Your profile has been updated successfully!');
        await fetchUserData();
        return;
      }
      showToast.error('Update Failed', (res.data as any)?.message ?? 'Failed to update profile');
    } catch (err: any) {
      showToast.error('Error Updating Profile', err?.response?.data?.message ?? err?.message);
    }
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast.error('Password Mismatch', 'New password and confirm password do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast.error('Invalid Password', 'Password must be at least 8 characters long');
      return;
    }

    try {
      const res = await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      } as any);

      if ((res.data as any)?.status === 200 || (res as any)?.status === 200) {
        showToast.success('Password Changed', 'Your password has been changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
        return;
      }

      showToast.error('Password Change Failed', (res.data as any)?.message ?? 'Failed to change password');
    } catch (err: any) {
      showToast.error('Error Changing Password', err?.response?.data?.message ?? err?.message);
    }
  };

  // --------------------------
  // Plans / Stripe
  // --------------------------
  const fetchPlans = async () => {
    try {
      const res = await planAPI.getAll();
      setPlans((res.data as any[]) ?? []);
    } catch {
      setPlans([]);
    }
  };

  const fetchMyPlan = async () => {
    try {
      const res = await userPlanAPI.getMyPlan();
      const up = (res.data as any)?.userPlan ?? res.data;
      setUserPlan(up ?? null);
      setSelectedPlanId(refId(up?.planId) || null);
    } catch (err: any) {
      // 404 is acceptable (user has no plan yet)
      if (err?.response?.status === 404) {
        setUserPlan(null);
        setSelectedPlanId(null);
        return;
      }
      setUserPlan(null);
      setSelectedPlanId(null);
    }
  };

  const confirmStripePayment = async (sessionId: string) => {
    try {
      const res = await userPlanAPI.confirmPayment({ sessionId } as any);
      const up = (res.data as any)?.userPlan ?? null;

      if (up) {
        setUserPlan(up);
        setSelectedPlanId(refId(up?.planId) || null);
        showToast.success('Payment Successful', 'Your subscription is now active!');
        await fetchMyPlan();
      }
    } catch (err: any) {
      showToast.error('Payment Confirmation Failed', err?.response?.data?.message ?? err?.message);
    }
  };

  const selectUserPlan = async (planId: string) => {
    if (selectingPlan) return;
    setSelectingPlan(true);

    try {
      const checkout = await userPlanAPI.createCheckoutSession({ planId } as any);
      const url = (checkout.data as any)?.url;

      if (url) {
        window.location.href = url;
        return;
      }

      // demo fallback
      const fallback = await userPlanAPI.selectPlan({ planId } as any);
      const up = (fallback.data as any)?.userPlan ?? null;

      if (up) {
        setUserPlan(up);
        setSelectedPlanId(planId);
        await fetchMyPlan();
      } else {
        showToast.error('Plan Selection Failed', (fallback.data as any)?.message ?? 'Failed to select plan');
      }
    } catch (err: any) {
      showToast.error('Error Selecting Plan', err?.response?.data?.message ?? err?.message);
    } finally {
      setSelectingPlan(false);
    }
  };

  // Stripe callback params (sessionid/planId/canceled)
  useEffect(() => {
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('sessionid');
    const planId = searchParams.get('planId');

    if (canceled === 'true') {
      showToast.warning('Payment Cancelled', 'You cancelled the payment process.');
      return;
    }

    if (sessionId && planId) {
      void confirmStripePayment(sessionId);

      // optional cleanup (removes query string)
      if (typeof window !== 'undefined') {
        router.replace(window.location.pathname);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // --------------------------
  // Workspace + data fetching
  // --------------------------
  const fetchWorkspaces = async () => {
    const res = await workspaceAPI.getAll();
    const ws = ((res.data as any[]) ?? []).map(toId);
    setWorkspaces(ws);

    setCurrentWorkspace((prev) => {
      if (prev?.id) return prev;
      return ws[0] ?? null;
    });
  };

  const fetchClientsForSubscription = async (subscriptionId: string) => {
    const res = await subscriptionClientAPI.getClientsForSubscription(subscriptionId);
    const links = (res.data as any[]) ?? [];
    const clientObjs = links
      .map((l) => l?.clientId)
      .filter(Boolean)
      .map((c) => (c?._id ? toId(c) : c));
    setSubscriptionClients((prev) => ({ ...prev, [subscriptionId]: clientObjs }));
  };

  const fetchWorkspaceData = async (workspaceId: string) => {
    setLoading(true);

    try {
      // subscriptions
      const subsRes = await subscriptionAPI.getByWorkspace(workspaceId);
      const subs = ((subsRes.data as any[]) ?? []).map(toId) as Subscription[];
      setSubscriptions(subs);

      // clients
      const clientsRes = await clientAPI.getByWorkspace(workspaceId);
      const cls = ((clientsRes.data as any[]) ?? []).map(toId) as Client[];
      setClients(cls);

      // budget (single per workspace)
      try {
        const budgetRes = await budgetAPI.getByWorkspace(workspaceId);
        const b = budgetRes.data as any;
        setBudgets(b?._id ? [toId(b)] : []);
      } catch {
        setBudgets([]);
      }

      // invoices (per subscription)
      const allInvoices: Invoice[] = [];
      for (const sub of subs) {
        try {
          const invRes = await invoiceAPI.getBySubscription(sub.id);
          const invs = ((invRes.data as any[]) ?? []).map(toId) as any[];
          invs.forEach((inv) => {
            allInvoices.push({
              ...(inv as any),
              subscriptionId: refId((inv as any).subscriptionId) || String((inv as any).subscriptionId ?? ''),
            });
          });
        } catch {
          // ignore per-sub errors
        }
      }
      setInvoices(allInvoices);

      // alerts (by workspace)
      try {
        const alertRes = await alertAPI.getByWorkspace(workspaceId);
        const als = ((alertRes.data as any[]) ?? []).map(toId) as any[];
        setAlerts(
          als.map((a) => ({
            ...(a as any),
            subscriptionId: refId((a as any).subscriptionId) || (a as any).subscriptionId,
          }))
        );
      } catch {
        setAlerts([]);
      }

      // subscriptionClients map
      const map: SubscriptionClientsMap = {};
      for (const sub of subs) {
        try {
          const linksRes = await subscriptionClientAPI.getClientsForSubscription(sub.id);
          const links = (linksRes.data as any[]) ?? [];
          map[sub.id] = links
            .map((l) => l?.clientId)
            .filter(Boolean)
            .map((c) => (c?._id ? toId(c) : c));
        } catch {
          map[sub.id] = [];
        }
      }
      setSubscriptionClients(map);
    } finally {
      setLoading(false);
    }
  };

  // initial mount: user + workspaces + plans
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchUserData();
      await fetchWorkspaces();
      await fetchPlans();
      await fetchMyPlan();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // workspace change => fetch everything
  useEffect(() => {
    if (!currentWorkspace?.id) return;
    void fetchWorkspaceData(currentWorkspace.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?.id]);

  // auto-refresh alerts every 5 mins
  useEffect(() => {
    if (!currentWorkspace?.id) return;

    const refresh = async () => {
      try {
        const res = await alertAPI.getByWorkspace(currentWorkspace.id);
        const als = ((res.data as any[]) ?? []).map(toId);
        setAlerts(
          als.map((a: any) => ({
            ...a,
            subscriptionId: refId(a.subscriptionId) || a.subscriptionId,
          }))
        );
      } catch {
        // ignore
      }
    };

    void refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentWorkspace?.id]);

  // --------------------------
  // Manage subscription clients (helper actions)
  // --------------------------
  const linkClientToSubscription = async (subscriptionId: string, clientId: string) => {
    try {
      await subscriptionClientAPI.linkClient({ subscriptionId, clientId } as any);
      await fetchClientsForSubscription(subscriptionId);
      showToast.success('Client Linked', 'Client has been linked to this subscription');
    } catch (err: any) {
      showToast.error('Error Linking Client', err?.response?.data?.message ?? err?.message);
    }
  };

  const unlinkClientFromSubscription = async (subscriptionId: string, clientId: string) => {
    try {
      await subscriptionClientAPI.unlinkClient({ subscriptionId, clientId } as any);
      await fetchClientsForSubscription(subscriptionId);
      showToast.success('Client Unlinked', 'Client has been removed from this subscription');
    } catch (err: any) {
      showToast.error('Error Unlinking Client', err?.response?.data?.message ?? err?.message);
    }
  };

  // --------------------------
  // Invoice upload helpers
  // --------------------------
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);

      const res = await uploadAPI.uploadInvoiceImage(fd);
      const fileUrl = (res.data as any)?.data?.fileUrl;

      if (!fileUrl) {
        showToast.error('Upload Failed', 'Failed to upload image');
        return null;
      }

      setInvoiceForm((p) => ({ ...p, fileUrl }));
      showToast.success('Image Uploaded', 'Invoice image uploaded successfully!');
      return String(fileUrl);
    } catch (err: any) {
      showToast.error('Upload Failed', err?.response?.data?.message ?? err?.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // --------------------------
  // CRUD: Subscriptions
  // --------------------------
  const createSubscription = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentWorkspace?.id) {
      showToast.warning('Workspace Required', 'Please select or create a workspace before adding a subscription.');
      return;
    }

    try {
      const tagsArray = subscriptionForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const nextRenewalDateIso = subscriptionForm.nextRenewalDate
        ? new Date(subscriptionForm.nextRenewalDate).toISOString()
        : null;

      const { clientId, ...subscriptionData } = subscriptionForm;

      const res = await subscriptionAPI.create({
        ...subscriptionData,
        workspaceId: currentWorkspace.id,
        amount: Number(subscriptionForm.amount),
        tags: tagsArray,
        nextRenewalDate: nextRenewalDateIso,
      } as any);

      const newSub = toId(res.data.subscription) as Subscription;
      setSubscriptions((prev) => [...prev, newSub]);

      if (clientId) {
        await subscriptionClientAPI.linkClient({ subscriptionId: newSub.id, clientId } as any);
        await fetchClientsForSubscription(newSub.id);
      }

      showToast.success('Subscription Created', `${(newSub as any).name ?? 'Subscription'} has been added successfully!`);
      setShowSubscriptionForm(false);
      setEditingItem(null);

      await fetchWorkspaceData(currentWorkspace.id);

      try {
        await alertAPI.triggerChecks();
        setTimeout(async () => {
          const a = await alertAPI.getByWorkspace(currentWorkspace.id);
          setAlerts(((a.data as any[]) ?? []).map(toId) as any);
        }, 2000);
      } catch {
        // ignore
      }
    } catch (err: any) {
      showToast.error('Error Creating Subscription', err?.response?.data?.message ?? err?.message);
    }
  };

  const updateSubscription = async (e: FormEvent) => {
    e.preventDefault();

    const sub = editingItem as Subscription | null;
    if (!sub?.id) return;

    try {
      const tagsArray = subscriptionForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const nextRenewalDateIso = subscriptionForm.nextRenewalDate
        ? new Date(subscriptionForm.nextRenewalDate).toISOString()
        : null;

      const res = await subscriptionAPI.update(sub.id, {
        ...subscriptionForm,
        amount: Number(subscriptionForm.amount),
        tags: tagsArray,
        nextRenewalDate: nextRenewalDateIso,
      } as any);

      const updated = toId(res.data.subscription) as Subscription;
      setSubscriptions((prev) => prev.map((s) => (s.id === sub.id ? updated : s)));

      showToast.success('Subscription Updated', `${(updated as any).name ?? 'Subscription'} has been updated successfully!`);
      setShowSubscriptionForm(false);
      setEditingItem(null);

      // refresh alerts & data (backend may remove outdated alerts)
      if (currentWorkspace?.id) {
        await fetchWorkspaceData(currentWorkspace.id);
        try {
          await alertAPI.triggerChecks();
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      showToast.error('Error Updating Subscription', err?.response?.data?.message ?? err?.message);
    }
  };

  const quickRenewal = async (sub: Subscription) => {
    if (!sub?.id) {
      showToast.warning('No Selection', 'No subscription selected.');
      return;
    }

    try {
      const currentDate = (sub as any).nextRenewalDate ? new Date((sub as any).nextRenewalDate) : new Date();
      const newDate = new Date(currentDate);

      const period = String((sub as any).period ?? 'monthly').toLowerCase();
      if (period === 'yearly') newDate.setFullYear(newDate.getFullYear() + 1);
      else if (period === 'quarterly') newDate.setMonth(newDate.getMonth() + 3);
      else newDate.setMonth(newDate.getMonth() + 1);

      const res = await subscriptionAPI.update(sub.id, {
        ...(sub as any),
        nextRenewalDate: newDate.toISOString().split('T')[0],
      } as any);

      const updated = toId(res.data.subscription) as Subscription;
      setSubscriptions((prev) => prev.map((s) => (s.id === sub.id ? updated : s)));

      showToast.success('Renewal Extended', `${(sub as any).name ?? 'Subscription'} renewal extended to ${newDate.toLocaleDateString()}`);

      if (currentWorkspace?.id) {
        try {
          await alertAPI.triggerChecks();
          const a = await alertAPI.getByWorkspace(currentWorkspace.id);
          setAlerts(((a.data as any[]) ?? []).map(toId) as any);
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      showToast.error('Error Extending Renewal', err?.response?.data?.message ?? err?.message);
    }
  };

  const deleteSubscription = (subscriptionId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Subscription',
      message: 'Are you sure you want to delete this subscription? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await subscriptionAPI.delete(subscriptionId);
          setSubscriptions((prev) => prev.filter((s) => s.id !== subscriptionId));
          setInvoices((prev) => prev.filter((inv: any) => refId((inv as any).subscriptionId) !== subscriptionId));
          setAlerts((prev: any) => prev.filter((a: any) => refId(a.subscriptionId) !== subscriptionId));
          showToast.success('Subscription Deleted', 'Subscription has been removed successfully!');
        } catch (err: any) {
          showToast.error('Error Deleting Subscription', err?.response?.data?.message ?? err?.message);
        } finally {
          setConfirmDialog((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  // --------------------------
  // CRUD: Clients
  // --------------------------
  const createClient = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentWorkspace?.id) {
      showToast.warning('Workspace Required', 'Please select or create a workspace before adding a client.');
      return;
    }

    try {
      const res = await clientAPI.create({
        ...clientForm,
        workspaceId: currentWorkspace.id,
      } as any);

      const newClient = toId(res.data.client) as Client;
      setClients((prev) => [...prev, newClient]);

      showToast.success('Client Created', `${(newClient as any).name ?? 'Client'} has been added successfully!`);
      setShowClientForm(false);
      setEditingItem(null);
    } catch (err: any) {
      showToast.error('Error Creating Client', err?.response?.data?.message ?? err?.message);
    }
  };

  const updateClient = async (e: FormEvent) => {
    e.preventDefault();

    const c = editingItem as Client | null;
    if (!c?.id) return;

    try {
      const res = await clientAPI.update(c.id, clientForm as any);
      const updated = toId(res.data.client) as Client;

      setClients((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
      showToast.success('Client Updated', `${(updated as any).name ?? 'Client'} has been updated successfully!`);
      setShowClientForm(false);
      setEditingItem(null);
    } catch (err: any) {
      showToast.error('Error Updating Client', err?.response?.data?.message ?? err?.message);
    }
  };

  const deleteClient = (clientId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Client',
      message: 'Are you sure you want to delete this client? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await clientAPI.delete(clientId);
          setClients((prev) => prev.filter((c) => c.id !== clientId));
          showToast.success('Client Deleted', 'Client has been removed successfully!');
        } catch (err: any) {
          showToast.error('Error Deleting Client', err?.response?.data?.message ?? err?.message);
        } finally {
          setConfirmDialog((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  // --------------------------
  // CRUD: Workspaces
  // --------------------------
  const createWorkspace = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await workspaceAPI.create({
        name: workspaceForm.name,
        monthlyCap: workspaceForm.monthlyCap ? Number(workspaceForm.monthlyCap) : undefined,
      } as any);

      const ws = toId(res.data.workspace) as Workspace;
      setWorkspaces((prev) => [...prev, ws]);
      setCurrentWorkspace(ws);

      showToast.success('Workspace Created', `${(ws as any).name ?? 'Workspace'} has been created successfully!`);
      setShowWorkspaceForm(false);
      setEditingItem(null);
    } catch (err: any) {
      showToast.error('Error Creating Workspace', err?.response?.data?.message ?? err?.message);
    }
  };

  const updateWorkspace = async (e: FormEvent) => {
    e.preventDefault();

    const ws = editingItem as Workspace | null;
    if (!ws?.id) return;

    try {
      const res = await workspaceAPI.update(ws.id, { name: workspaceForm.name } as any);
      const updated = toId(res.data.workspace) as Workspace;

      setWorkspaces((prev) => prev.map((w) => (w.id === ws.id ? updated : w)));
      setCurrentWorkspace((cur) => (cur?.id === ws.id ? updated : cur));

      showToast.success('Workspace Updated', `${(updated as any).name ?? 'Workspace'} has been updated successfully!`);
      setShowWorkspaceForm(false);
      setEditingItem(null);
    } catch (err: any) {
      showToast.error('Error Updating Workspace', err?.response?.data?.message ?? err?.message);
    }
  };

  const deleteWorkspace = (workspaceId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Workspace',
      message:
        'Are you sure you want to delete this workspace? This will also delete all subscriptions, clients, invoices, and alerts associated with it.',
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await workspaceAPI.delete(workspaceId);

          setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
          setCurrentWorkspace((cur) => {
            if (cur?.id !== workspaceId) return cur;
            const remaining = workspaces.filter((w) => w.id !== workspaceId);
            return remaining[0] ?? null;
          });

          showToast.success('Workspace Deleted', 'Workspace has been removed successfully!');
        } catch (err: any) {
          showToast.error('Error Deleting Workspace', err?.response?.data?.message ?? err?.message);
        } finally {
          setConfirmDialog((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  // --------------------------
  // CRUD: Invoices
  // --------------------------
  const createInvoice = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let fileUrl = invoiceForm.fileUrl;

      if (invoiceImageFile && !fileUrl) {
        const uploadedUrl = await handleImageUpload(invoiceImageFile);
        if (!uploadedUrl) return;
        fileUrl = uploadedUrl;
      }

      const res = await invoiceAPI.create({
        ...invoiceForm,
        fileUrl,
        amount: Number(invoiceForm.amount),
        invoiceDate: new Date(invoiceForm.invoiceDate).toISOString(),
      } as any);

      const inv = toId(res.data.invoice) as Invoice;
      setInvoices((prev) => [...prev, inv]);

      showToast.success('Invoice Created', 'Invoice has been added successfully!');
      setShowInvoiceForm(false);
      setEditingItem(null);
      setInvoiceImageFile(null);

      if (currentWorkspace?.id) await fetchWorkspaceData(currentWorkspace.id);
    } catch (err: any) {
      showToast.error('Error Creating Invoice', err?.response?.data?.message ?? err?.message);
    }
  };

  const updateInvoice = async (e: FormEvent) => {
    e.preventDefault();

    const inv = editingItem as Invoice | null;
    if (!inv?.id) return;

    try {
      // do not allow subscriptionId to change on update
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { subscriptionId, ...rest } = invoiceForm;

      const res = await invoiceAPI.update(inv.id, {
        ...rest,
        amount: Number(invoiceForm.amount),
        invoiceDate: new Date(invoiceForm.invoiceDate).toISOString(),
      } as any);

      const updated = toId(res.data.invoice) as Invoice;
      setInvoices((prev) => prev.map((x) => (x.id === inv.id ? updated : x)));

      showToast.success('Invoice Updated', 'Invoice has been updated successfully!');
      setShowInvoiceForm(false);
      setEditingItem(null);

      if (currentWorkspace?.id) await fetchWorkspaceData(currentWorkspace.id);
    } catch (err: any) {
      showToast.error('Error Updating Invoice', err?.response?.data?.message ?? err?.message);
    }
  };

  const deleteInvoice = (invoiceId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Invoice',
      message: 'Are you sure you want to delete this invoice? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await invoiceAPI.delete(invoiceId);
          setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
          showToast.success('Invoice Deleted', 'Invoice has been removed successfully!');

          if (currentWorkspace?.id) await fetchWorkspaceData(currentWorkspace.id);
        } catch (err: any) {
          showToast.error('Error Deleting Invoice', err?.response?.data?.message ?? err?.message);
        } finally {
          setConfirmDialog((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  // --------------------------
  // CRUD: Budget
  // --------------------------
  const updateBudget = async (e: FormEvent) => {
    e.preventDefault();

    const current = budgets[0];
    if (!current?.id) {
      showToast.warning('No Budget', 'No budget found to update.');
      return;
    }

    try {
      const res = await budgetAPI.update(current.id, {
        monthlyCap: Number(budgetForm.monthlyCap),
        alertThreshold: Number(budgetForm.alertThreshold),
      } as any);

      const updated = toId(res.data.budget) as Budget;
      setBudgets([updated]);
      showToast.success('Budget Updated', 'Your budget has been updated successfully!');

      if (currentWorkspace?.id) {
        try {
          const a = await alertAPI.getByWorkspace(currentWorkspace.id);
          setAlerts(((a.data as any[]) ?? []).map(toId) as any);
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      showToast.error('Error Updating Budget', err?.response?.data?.message ?? err?.message);
    }
  };

  // --------------------------
  // Derived stats
  // --------------------------
  const stats = useMemo(() => {
    const totalMonthlySpend = subscriptions.reduce((sum, s) => sum + toMonthlyEquivalent(s), 0);

    const upcomingRenewals = subscriptions.filter((s: any) => {
      if (!s.nextRenewalDate) return false;
      const d = new Date(s.nextRenewalDate);
      const days = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 7 && days >= 0;
    }).length;

    const urgentAlerts = (alerts as any[]).filter((a) => {
      const d = new Date(a?.dueDate);
      const days = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 3;
    }).length;

    const currentBudget = budgets[0];
    const budgetUsage = currentBudget?.monthlyCap ? (totalMonthlySpend / Number(currentBudget.monthlyCap)) * 100 : 0;

    return {
      totalMonthlySpend,
      activeSubscriptionsCount: subscriptions.length,
      totalClientsCount: clients.length,
      totalInvoicesCount: invoices.length,
      upcomingRenewals,
      urgentAlerts,
      currentBudget,
      budgetUsage,
    };
  }, [alerts, budgets, clients.length, invoices.length, subscriptions]);

  // --------------------------
  // Charts 
  // --------------------------
  const spendingData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const periodMonths = spendingPeriod === '1Y' ? 12 : 6;
    const data: Array<{ month: string; amount: number; fullMonth: string; year: number }> = [];

    for (let i = periodMonths - 1; i >= 0; i--) {
      const monthOffset = currentMonth - i;
      const targetYear = monthOffset < 0 ? currentYear - 1 : currentYear;
      const targetMonth = monthOffset < 0 ? monthOffset + 12 : monthOffset;

      const targetMonthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

      const monthSpending = subscriptions.reduce((sum, sub: any) => {
        const createdAt = sub?.createdAt ? new Date(sub.createdAt) : new Date(0);
        if (createdAt > targetMonthEnd) return sum;
        return sum + toMonthlyEquivalent(sub);
      }, 0);

      const label =
        spendingPeriod === '1Y'
          ? `${months[targetMonth]} ${String(targetYear).slice(-2)}`
          : months[targetMonth];

      data.push({
        month: label,
        amount: Math.round(monthSpending * 100) / 100,
        fullMonth: months[targetMonth],
        year: targetYear,
      });
    }

    return data;
  }, [subscriptions, spendingPeriod]);

  const categoryData = useMemo(() => {
    const colors = ['#8b5cf6', '#a78bfa', '#60a5fa', '#db2777', '#4ade80', '#f59e0b', '#84cc16', '#06b6d4'];
    const acc = new Map<string, number>();

    subscriptions.forEach((sub: any) => {
      const key = sub.category || 'Uncategorized';
      acc.set(key, (acc.get(key) || 0) + toMonthlyEquivalent(sub));
    });

    return Array.from(acc.entries()).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length],
    }));
  }, [subscriptions]);

  return {
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

    // ui state
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

    // invoice upload
    invoiceImageFile,
    setInvoiceImageFile,
    uploadingImage,
    handleImageUpload,

    // settings/profile
    profileForm,
    setProfileForm,
    updateProfile,
    passwordForm,
    setPasswordForm,
    showPasswordForm,
    setShowPasswordForm,
    changePassword,

    // plans
    plans,
    userPlan,
    selectedPlanId,
    selectingPlan,
    selectUserPlan,

    // charts
    spendingPeriod,
    setSpendingPeriod,
    spendingData,
    categoryData,

    // actions
    handleLogout,
    fetchWorkspaceData,
    fetchClientsForSubscription,
    linkClientToSubscription,
    unlinkClientFromSubscription,

    createSubscription,
    updateSubscription,
    deleteSubscription,
    quickRenewal,

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

    // dialog
    
    confirmDialog,
    setConfirmDialog,

    // derived
    stats,
  };
}
