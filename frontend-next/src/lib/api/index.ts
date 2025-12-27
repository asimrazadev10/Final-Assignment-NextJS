import api from './http';
import type {
  Alert,
  Invoice,
  User,
  Workspace,
} from '@/app/dashboard/_lib/types';
import type { SubscriptionDoc, SubscriptionClientLinkDoc, ClientDoc, BudgetDoc, UserData } from './types';
type Id = string | number;

export const authAPI = {
  register: async (userData: UserData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login: async (email:string, password:string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  update: (data: any) => api.put('/users/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/users/me/change-password', data),

  updateByUsername: (username: string, data: any) => api.put(`/users/${username}`, data),
  search: (query: string) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
  getByUsername: (username: string) => api.get(`/users/${username}`),

  // Admin endpoints
  getAll: () => api.get('/users/admin/all'),
  create: (data: any) => api.post('/users/admin/create', data),
  updateById: (id: Id, data: any) => api.put(`/users/admin/${id}`, data),
  deleteById: (id: Id) => api.delete(`/users/admin/${id}`),
};

export const planAPI = {
  getAll: () => api.get('/plans/getPlans'),
  get: (id: Id) => api.get(`/plans/getPlan/${id}`),
  create: (data: any) => api.post('/plans/createPlan', data),
  update: (id: Id, data: any) => api.put(`/plans/updatePlan/${id}`, data),
  delete: (id: Id) => api.delete(`/plans/deletePlan/${id}`),
};

export const userPlanAPI = {
  createCheckoutSession: (data: { planId: Id }) => api.post('/userPlans/create-checkout-session', data),
  confirmPayment: (data: { sessionId: string }) => api.post('/userPlans/confirm-payment', data),
  selectPlan: (data: { planId: Id }) => api.post('/userPlans/select', data),
  getMyPlan: () => api.get('/userPlans/my-plan'),
  getUserPlan: (userId: Id) => api.get(`/userPlans/plan/${userId}`),
};

export const workspaceAPI = {
  getAll: () => api.get<Workspace[]>('/workspaces'),
  create: (data: Pick<Workspace, 'name'> & { monthlyCap?: number }) =>
    api.post<{ workspace: Workspace }>('/workspaces/', data),
  update: (id: string, data: Partial<Workspace>) =>
    api.put<{ workspace: Workspace }>(`/workspaces/${id}`, data),
  delete: (id: string) => api.delete(`/workspaces/${id}`),
};

export const subscriptionAPI = {
  getByWorkspace: (workspaceId: string) =>
    api.get<SubscriptionDoc[]>(`/subscriptions/workspace/${workspaceId}`),

  create: (data: Partial<SubscriptionDoc> & { workspaceId: string }) =>
    api.post<{ status: number; message: string; subscription: SubscriptionDoc }>(
      '/subscriptions/',
      data
    ),

  update: (id: string, data: Partial<SubscriptionDoc>) =>
    api.put<{ status: number; message: string; subscription: SubscriptionDoc }>(
      `/subscriptions/${id}`,
      data
    ),

  delete: (id: string) => api.delete(`/subscriptions/${id}`),
};


export const clientAPI = {
  getByWorkspace: (workspaceId: string) =>
    api.get<ClientDoc[]>(`/clients/workspace/${workspaceId}`), // array [file:6]

  get: (id: string) => api.get<ClientDoc>(`/clients/${id}`), // plain doc [file:6]

  create: (data: Pick<ClientDoc, 'workspaceId' | 'name'> & Partial<Pick<ClientDoc, 'contact' | 'notes'>>) =>
    api.post<{ status: 201; message: string; client: ClientDoc }>('/clients/', data), // wrapped [file:6]

  update: (id: string, data: Partial<Pick<ClientDoc, 'name' | 'contact' | 'notes'>>) =>
    api.put<{ status: 200; message: string; client: ClientDoc }>(`/clients/${id}`, data), // wrapped [file:6]

  delete: (id: string) => api.delete<{ status: 200; message: string }>(`/clients/${id}`), // wrapped [file:6]
};

export const invoiceAPI = {
  getBySubscription: (subscriptionId: string) =>
    api.get<Invoice[]>(`/invoices/subscription/${subscriptionId}`),
  create: (data: Partial<Invoice> & { subscriptionId: string }) =>
    api.post<{ invoice: Invoice }>('/invoices/', data),
  update: (id: string, data: Partial<Invoice>) =>
    api.put<{ invoice: Invoice }>(`/invoices/${id}`, data),
  delete: (id: string) => api.delete(`/invoices/${id}`),
};

export const uploadAPI = {
  uploadInvoiceImage: (formData: FormData) =>
    api.post('/upload/invoice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const alertAPI = {
  getByWorkspace: (workspaceId: string) =>
    api.get<Alert[]>(`/alerts/workspace/${workspaceId}`),
  triggerChecks: () => api.post('/alerts/trigger-checks'),
};

export const budgetAPI = {
  getByWorkspace: (workspaceId: string) =>
    api.get<BudgetDoc>(`/budgets/${workspaceId}`),

  update: (id: string, data: Pick<BudgetDoc, 'monthlyCap' | 'alertThreshold'>) =>
    api.put<{ status: 200; message: string; budget: BudgetDoc }>(
      `/budgets/${id}`,
      data
    ),
};
export const subscriptionClientAPI = {
  linkClient: (data: { subscriptionId: string; clientId: string }) =>
    api.post('/subscriptionClients/link-client', data),
  unlinkClient: (data: { subscriptionId: string; clientId: string }) =>
    api.post('/subscriptionClients/unlink-client', data),
  getClientsForSubscription: (subscriptionId: string) =>
    api.get<SubscriptionClientLinkDoc[]>(
      `/subscriptionClients/clients/${subscriptionId}`
    ),
};
