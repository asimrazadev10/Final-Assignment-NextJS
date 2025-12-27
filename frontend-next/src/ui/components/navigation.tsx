'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { showToast } from "@/lib/toast";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // Ensure we are on the client side before accessing localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") checkAuth();
    };

    const onAuthChanged = () => checkAuth();

    window.addEventListener("storage", onStorage);
    // Note: 'authChanged' is a custom event. Ensure you dispatch this elsewhere in your app too.
    window.addEventListener("authChanged", onAuthChanged);

    checkAuth();

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChanged"));
    showToast.success("Logged Out", "You have been successfully logged out");
    setIsOpen(false);
    
    // Delay navigation to allow toast to display
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 shadow-lg shadow-purple-600/40" />
              <span className="text-2xl font-bold heading-gradient">
                SubFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                href="/" 
                className={`nav-link ${isActive('/') ? 'text-white underline' : ''}`}
              >
                Home
              </Link>
              {isLoggedIn && (
                <Link 
                  href="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'text-white underline' : ''}`}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                href="/about" 
                className={`nav-link ${isActive('/about') ? 'text-white underline' : ''}`}
              >
                About
              </Link>
              <Link 
                href="/services" 
                className={`nav-link ${isActive('/services') ? 'text-white underline' : ''}`}
              >
                Services
              </Link>
              <Link 
                href="/contact" 
                className={`nav-link ${isActive('/contact') ? 'text-white underline' : ''}`}
              >
                Contact
              </Link>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="btn-gradient px-4 py-2 cursor-default">Welcome!</span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className={`nav-link ${isActive('/login') ? 'text-white underline' : ''}`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-gradient px-6 py-2 font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 nav-link hover:bg-white/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 nav-link hover:bg-white/5 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/about"
              className="block px-3 py-2 nav-link hover:bg-white/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="block px-3 py-2 nav-link hover:bg-white/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 nav-link hover:bg-white/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 nav-link hover:bg-white/5 rounded-md"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 nav-link hover:bg-white/5 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block mx-3 mt-4 btn-gradient text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}