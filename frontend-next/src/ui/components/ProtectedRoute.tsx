'use client';

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // localStorage is only available in the browser
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setIsAuthenticated(false);
          showToast.error("Authentication Required", "Please log in to access this page.");
          router.push("/login");
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    // Check immediately
    checkAuth();

    // Listen for custom auth events (from your login/register logic)
    const onAuthChanged = () => checkAuth();
    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, [router]);

  // Show loading while checking
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the useEffect will handle the redirect.
  // We return null here to prevent the protected content from flashing.
  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}