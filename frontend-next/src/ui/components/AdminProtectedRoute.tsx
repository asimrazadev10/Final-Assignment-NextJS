'use client';

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { userAPI } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState("Checking admin access...");

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem("token");

      // 1. No Token -> Redirect to Login
      if (!token) {
        setIsAuthorized(false);
        router.push("/login");
        return;
      }

      try {
        // 2. Token exists -> Verify Admin Role
        const response = await userAPI.getMe();
        
        if (response.data?.role === "admin") {
          setIsAuthorized(true);
        } else {
          // 3. Not Admin -> Redirect to Dashboard
          setIsAuthorized(false);
          showToast.error("Access Denied", "You must be an admin to access this page.");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAuthorized(false);
        router.push("/login"); // Fallback on error
      }
    };

    checkAuth();

    // Listen for auth changes
    const onAuthChanged = () => checkAuth();
    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, [router]);

  // Loading State
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">{statusMessage}</p>
        </div>
      </div>
    );
  }

  // Prevent rendering if not authorized (redirect happens in useEffect)
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}