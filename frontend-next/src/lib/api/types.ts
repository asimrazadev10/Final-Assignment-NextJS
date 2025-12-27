export interface UserData {
  name: string;
  username: string;
  email: string;
  password: string;
  companyName?: string;
}
export interface MongoDoc {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceDoc extends MongoDoc {
  name: string;
  ownerId: string;
}

export interface SubscriptionDoc extends MongoDoc {
  workspaceId: string; // likely ObjectId as string in JSON
  name: string;
  vendor: string;
  plan: string;
  amount: number;
  currency: string;
  period: string;
  nextRenewalDate: string | null;
  category?: string;
  notes?: string;
  tags: string[];
}

export interface ClientDoc extends MongoDoc {
  name: string;
  contact?: string;
  notes?: string;
  workspaceId: string;
}

export interface SubscriptionClientLinkDoc extends MongoDoc {
  subscriptionId: string;
  clientId: Pick<ClientDoc, "_id" | "name" | "contact" | "notes">;
}

export interface ClientDoc {
  _id: string;
  workspaceId: string;
  name: string;
  contact?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetDoc {
  _id: string;
  workspaceId: string;
  monthlyCap: number;
  alertThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}
