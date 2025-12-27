export type DashboardTabId =
  | 'dashboard'
  | 'workspaces'
  | 'subscriptions'
  | 'clients'
  | 'invoices'
  | 'alerts'
  | 'budgets'
  | 'settings';

export interface User {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
}

export interface Workspace {
  id: string;
  name: string;
  monthlyCap?: number;
  createdAt?: string;
}

export interface Subscription {
  id: string;
  workspaceId: string;
  name: string;
  vendor: string;
  plan: string;
  amount: number;
  currency: string;
  period: string;
  nextRenewalDate?: string | null;
  category?: string;
  notes?: string;
  tags?: string[];
}

export interface Client {
  id: string;
  workspaceId: string;
  name: string;
  contact?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  fileUrl?: string;
  amount: number;
  invoiceDate: string;
  status: string;
  source: string;
}

export interface Alert {
  id: string;
  type: string;
  dueDate: string;
  subscriptionId?: string;
}

export interface Budget {
  id: string;
  workspaceId: string;
  monthlyCap: number;
  alertThreshold: number;
}

export type SubscriptionClientsMap = Record<string, Client[]>;
