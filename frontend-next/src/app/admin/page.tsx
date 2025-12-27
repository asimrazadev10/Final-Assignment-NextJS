'use client';

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  User as UserIcon,
  CheckCircle2,
  X,
  LayoutDashboard
} from "lucide-react";
import { userAPI, planAPI } from "@/lib/api";
import { showToast } from "@/lib/toast";
import ConfirmDialog from "@/ui/components/ConfirmDialog";

// --- Interfaces ---

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: "user" | "admin";
  companyName?: string;
  createdAt: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  featuresJSON?: Record<string, string>;
}

interface FeatureItem {
  key: string;
  value: string;
}

interface UserFormState {
  username: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  companyName: string;
}

interface PlanFormState {
  name: string;
  price: string | number;
  features: FeatureItem[];
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText: string;
  variant: "danger" | "warning" | "info";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('view') || 'dashboard';

  // --- State Management ---

  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  // Search
  const [userSearch, setUserSearch] = useState("");
  const [planSearch, setPlanSearch] = useState("");

  // User Form State
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserFormState>({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "user",
    companyName: "",
  });

  // Plan Form State
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState<PlanFormState>({
    name: "",
    price: "",
    features: [],
  });

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Delete",
    variant: "danger",
  });

  // --- Initial Data Load ---

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPlans()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      // Handle response structure { data: [...] } or direct array
      const usersData = response.data?.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      showToast.error("Error", error.response?.data?.message || "Failed to fetch users");
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await planAPI.getAll();
      const plansData = response.data || [];
      setPlans(Array.isArray(plansData) ? plansData : []);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      showToast.error("Error", error.response?.data?.message || "Failed to fetch plans");
    }
  };

  // --- User CRUD Operations ---

  const createUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...userForm,
        password: userForm.password || undefined,
      };
      if (!formData.password) delete formData.password;

      const response = await userAPI.create(formData);
      const newUser = response.data?.data?.user || response.data?.user;

      if (newUser) {
        setUsers((prev) => [newUser, ...prev]);
        showToast.success("Success", "User created successfully!");
        setShowUserForm(false);
        resetUserForm();
      } else {
        // Fallback refresh
        await fetchUsers();
        showToast.success("Success", "User created successfully!");
        setShowUserForm(false);
        resetUserForm();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      showToast.error("Error", error.response?.data?.message || "Failed to create user");
    }
  };

  const updateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser?._id) return;

    try {
      const formData = { ...userForm };
      if (!formData.password || formData.password.trim() === "") {
        delete formData.password;
      }

      const response = await userAPI.updateById(editingUser._id, formData);
      const updatedUser = response.data?.data?.user || response.data?.user;

      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? updatedUser : u))
        );
        showToast.success("Success", "User updated successfully!");
        setShowUserForm(false);
        setEditingUser(null);
        resetUserForm();
      } else {
        await fetchUsers();
        showToast.success("Success", "User updated successfully!");
        setShowUserForm(false);
        setEditingUser(null);
        resetUserForm();
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      showToast.error("Error", error.response?.data?.message || "Failed to update user");
    }
  };

  const deleteUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await userAPI.deleteById(userId);
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          showToast.success("Success", "User deleted successfully");
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (error: any) {
          showToast.error("Error", error.response?.data?.message || "Failed to delete user");
        }
      },
    });
  };

  // --- Plan CRUD Operations ---

  const createPlan = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const featuresJSON: Record<string, string> = {};
      planForm.features.forEach((feature) => {
        if (feature.key && feature.key.trim()) {
          featuresJSON[feature.key.trim()] = feature.value || "";
        }
      });

      const formData = {
        name: planForm.name,
        price: Number(planForm.price),
        featuresJSON: featuresJSON,
      };

      const response = await planAPI.create(formData);
      if (response.data?.plan) {
        setPlans((prev) => [response.data.plan, ...prev]);
        showToast.success("Success", "Plan created successfully!");
        setShowPlanForm(false);
        resetPlanForm();
      } else {
        await fetchPlans();
        showToast.success("Success", "Plan created successfully!");
        setShowPlanForm(false);
        resetPlanForm();
      }
    } catch (error: any) {
      console.error("Error creating plan:", error);
      showToast.error("Error", error.response?.data?.message || "Failed to create plan");
    }
  };

  const updatePlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPlan?._id) return;

    try {
      const featuresJSON: Record<string, string> = {};
      planForm.features.forEach((feature) => {
        if (feature.key && feature.key.trim()) {
          featuresJSON[feature.key.trim()] = feature.value || "";
        }
      });

      const formData = {
        name: planForm.name,
        price: Number(planForm.price),
        featuresJSON: featuresJSON,
      };

      const response = await planAPI.update(editingPlan._id, formData);
      const updatedPlan = response.data?.plan;

      if (updatedPlan) {
        setPlans((prev) =>
          prev.map((p) => (p._id === editingPlan._id ? updatedPlan : p))
        );
        showToast.success("Success", "Plan updated successfully!");
        setShowPlanForm(false);
        setEditingPlan(null);
        resetPlanForm();
      } else {
        await fetchPlans();
        showToast.success("Success", "Plan updated successfully!");
        setShowPlanForm(false);
        setEditingPlan(null);
        resetPlanForm();
      }
    } catch (error: any) {
      console.error("Error updating plan:", error);
      showToast.error("Error", error.response?.data?.message || "Failed to update plan");
    }
  };

  const deletePlan = (planId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Plan",
      message: "Are you sure you want to delete this plan? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await planAPI.delete(planId);
          setPlans((prev) => prev.filter((p) => p._id !== planId));
          showToast.success("Success", "Plan deleted successfully");
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (error: any) {
          showToast.error("Error", error.response?.data?.message || "Failed to delete plan");
        }
      },
    });
  };

  // --- Helpers & Form Handlers ---

  const switchTab = (view: string) => {
    router.push(`/admin?view=${view}`);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      username: user.username || "",
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
      companyName: user.companyName || "",
    });
    setShowUserForm(true);
  };

  const editPlan = (plan: Plan) => {
    setEditingPlan(plan);
    const features = plan.featuresJSON
      ? Object.entries(plan.featuresJSON).map(([key, value]) => ({ key, value: String(value) }))
      : [];
    setPlanForm({
      name: plan.name || "",
      price: plan.price || "",
      features: features,
    });
    setShowPlanForm(true);
  };

  const resetUserForm = () => {
    setUserForm({
      username: "",
      name: "",
      email: "",
      password: "",
      role: "user",
      companyName: "",
    });
  };

  const resetPlanForm = () => {
    setPlanForm({
      name: "",
      price: "",
      features: [],
    });
  };

  const addFeature = () => {
    setPlanForm({
      ...planForm,
      features: [...planForm.features, { key: "", value: "" }],
    });
  };

  const removeFeature = (index: number) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const updatedFeatures = [...planForm.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setPlanForm({ ...planForm, features: updatedFeatures });
  };

  // --- Filtering & Stats ---

  const filteredUsers = users.filter((user) => {
    const searchLower = userSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  const filteredPlans = plans.filter((plan) => {
    const searchLower = planSearch.toLowerCase();
    return plan.name?.toLowerCase().includes(searchLower);
  });

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const regularUsers = users.filter((u) => u.role === "user").length;
  const totalPlans = plans.length;

  if (loading && users.length === 0 && plans.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        select option {
          background-color: #1a1a1a;
          color: white;
          padding: 8px;
        }
        select option:checked {
          background-color: #7c3aed;
        }
      `}</style>

      {/* Header */}
      <header className="bg-black/50 border-b border-white/10 sticky top-0 z-30 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {activeTab === "dashboard" && "Admin Dashboard Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "plans" && "Plan Management"}
            </h2>
            <p className="text-sm text-gray-400">
              {activeTab === "dashboard" && "Manage users and plans"}
              {activeTab === "users" && "Create, update, and delete users"}
              {activeTab === "plans" && "Create, update, and delete plans"}
            </p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        
        {/* --- Dashboard View --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Total Users" value={totalUsers} icon={Users} color="purple" />
              <StatsCard title="Admin Users" value={adminUsers} icon={Shield} color="blue" />
              <StatsCard title="Regular Users" value={regularUsers} icon={UserIcon} color="green" />
              <StatsCard title="Total Plans" value={totalPlans} icon={Package} color="orange" />
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => { switchTab("users"); setShowUserForm(true); resetUserForm(); setEditingUser(null); }}
                  className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  <Plus className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Create New User</span>
                </button>
                <button
                  onClick={() => { switchTab("plans"); setShowPlanForm(true); resetPlanForm(); setEditingPlan(null); }}
                  className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  <Plus className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Create New Plan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Users View --- */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => { setShowUserForm(true); resetUserForm(); setEditingUser(null); }}
                className="btn-gradient px-4 py-2 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Company</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {u.name?.charAt(0) || u.username?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{u.name || u.username}</p>
                              <p className="text-xs text-gray-400">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            u.role === "admin" ? "bg-purple-600/30 text-purple-400" : "bg-blue-600/30 text-blue-400"
                          }`}>
                            {u.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{u.companyName || "-"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => editUser(u)} 
                              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteUser(u._id)} 
                              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No users found</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Plans View --- */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={planSearch}
                  onChange={(e) => setPlanSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => { setShowPlanForm(true); resetPlanForm(); setEditingPlan(null); }}
                className="btn-gradient px-4 py-2 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.map((plan) => (
                <div key={plan._id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-2xl font-bold text-purple-400">${plan.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editPlan(plan)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePlan(plan._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {plan.featuresJSON && Object.keys(plan.featuresJSON).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2">Features:</p>
                      <div className="space-y-1">
                        {Object.entries(plan.featuresJSON).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span>{key}: {String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {filteredPlans.length === 0 && (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No plans found</h3>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- User Form Modal --- */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-white/10 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="p-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? "Edit User" : "Create New User"}
              </h3>
            </div>
            <form onSubmit={editingUser ? updateUser : createUser} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Username *</label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Password {editingUser ? "(leave blank to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    value={userForm.password || ""}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={userForm.companyName}
                    onChange={(e) => setUserForm({ ...userForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="p-6 pt-4 border-t border-white/10 flex gap-3">
                <button type="submit" className="flex-1 btn-gradient py-2 rounded-lg font-semibold">
                  {editingUser ? "Update User" : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUserForm(false); setEditingUser(null); resetUserForm(); }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Plan Form Modal --- */}
      {showPlanForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-white/10 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="p-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                {editingPlan ? "Edit Plan" : "Create New Plan"}
              </h3>
            </div>
            <form onSubmit={editingPlan ? updatePlan : createPlan} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Plan Name *</label>
                  <input
                    type="text"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-400">Features</label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-sm font-semibold border border-purple-600/30 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {planForm.features.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">No features added.</p>
                    ) : (
                      planForm.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg border border-white/10">
                          <input
                            type="text"
                            placeholder="Key"
                            value={feature.key}
                            onChange={(e) => updateFeature(index, "key", e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={feature.value}
                            onChange={(e) => updateFeature(index, "value", e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-4 border-t border-white/10 flex gap-3">
                <button type="submit" className="flex-1 btn-gradient py-2 rounded-lg font-semibold">
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPlanForm(false); setEditingPlan(null); resetPlanForm(); }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
      />
    </>
  );
}

// Stats Card Helper
function StatsCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  const colorMap: Record<string, string> = {
    purple: "text-purple-400 bg-purple-600/30",
    blue: "text-blue-400 bg-blue-600/30",
    green: "text-green-400 bg-green-600/30",
    orange: "text-orange-400 bg-orange-600/30",
  };

  const cssColor = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cssColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
}