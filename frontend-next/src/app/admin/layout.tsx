"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, Users, Package, Menu, X, LogOut } from "lucide-react";
import { userAPI } from "@/lib/api";
import { showToast } from "@/lib/toast";
import AdminProtectedRoute from "@/ui/components/AdminProtectedRoute";

interface User {
  name?: string;
  username?: string;
  email?: string;
  role?: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "dashboard";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await userAPI.getMe();
      const userData = response.data;
      setUser(userData);

      if (userData.role !== "admin") {
        showToast.error(
          "Access Denied",
          "You must be an admin to access this page"
        );
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged"));
    showToast.success("Logged Out", "You have been successfully logged out");
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", icon: Users, label: "Users" },
    { id: "plans", icon: Package, label: "Plans" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-black overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-72" : "w-20"
          } fixed lg:sticky top-16 bottom-0 left-0 z-40 bg-black/40 border-r border-white/10 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col`}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/50 hover:scale-105 transition-transform"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/admin?view=${item.id}`}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === item.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-medium text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {sidebarOpen && user && (
            <div className="p-4 border-t border-white/10 space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.name?.charAt(0) || user.username?.charAt(0) || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-900/20 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group"
              >
                <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                <span className="font-medium text-sm text-red-400 group-hover:text-red-300">
                  Logout
                </span>
              </button>
            </div>
          )}
        </aside>

        {/* Main Content Wrapper */}
        <main className="flex-1 overflow-y-auto relative z-10">{children}</main>
      </div>
    </AdminProtectedRoute>
  );
}
