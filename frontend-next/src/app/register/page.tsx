'use client';

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { toast } from "sonner";

// Define the shape of the form state
interface RegistrationFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  agreeToTerms: boolean;
  subscribeToUpdates: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    agreeToTerms: false,
    subscribeToUpdates: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Client-side validation
  const validateForm = (): boolean => {
    // Name validation - alphabetic only, 6-35 characters
    const namePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)?$/;
    if (!namePattern.test(formData.name.trim())) {
      showToast.error("Invalid Name", "Name must contain only alphabetic characters");
      return false;
    }
    if (formData.name.trim().length < 6 || formData.name.trim().length > 35) {
      showToast.error("Invalid Name", "Name must be between 6 and 35 characters");
      return false;
    }

    // Username validation - 6-35 characters
    if (formData.username.trim().length < 6 || formData.username.trim().length > 35) {
      showToast.error("Invalid Username", "Username must be between 6 and 35 characters");
      return false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      showToast.error("Invalid Email", "Please enter a valid email address");
      return false;
    }

    // Password validation
    if (formData.password.length < 1) {
      showToast.error("Password Required", "Please enter a password");
      return false;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      showToast.error("Password Mismatch", "Passwords don't match!");
      return false;
    }

    if (!formData.agreeToTerms) {
      showToast.error("Terms Required", "Please agree to the Terms of Service and Privacy Policy");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const loadingToast = showToast.loading("Creating your account...");
    
    try {
      const registrationData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        companyName: formData.companyName.trim() || undefined
      };

      const response = await authAPI.register(registrationData);
      
      if (response.status === 201 || response.token) {
        toast.dismiss(loadingToast);
        showToast.success("Account Created!", response.message || "Registration successful! Redirecting to dashboard...");
        
        // Store token if provided
        if (response.token) {
          localStorage.setItem('token', response.token);
          // Notify other components in the same tab to update auth state
          try {
            window.dispatchEvent(new Event('authChanged'));
          } catch (e) {
            // ignore error
          }
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        toast.dismiss(loadingToast);
        showToast.error("Registration Failed", response.message || "Please try again");
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      // Handle validation errors from backend
      if (err.response?.data?.message) {
        showToast.error("Registration Failed", err.response.data.message);
      } else if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((e: any) => e.msg)
          .join(", ");
        showToast.error("Validation Error", validationErrors);
      } else {
        showToast.error("Registration Failed", "An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const features = [
    "Track unlimited subscriptions",
    "Smart renewal alerts",
    "Cost optimization insights",
    "Team collaboration tools",
    "Secure data encryption",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="chip mb-4">Join SubFlow</div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                Start Your <span className="heading-gradient">Free Trial</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Join hundreds of Pakistani entrepreneurs managing their subscriptions smarter
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="card-glass p-8 space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2 text-sm">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="John Doe (6-35 characters, letters only)"
                />
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-white font-medium mb-2 text-sm">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="username (6-35 characters)"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="john@company.com"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="companyName" className="block text-white font-medium mb-2 text-sm">
                  Company/Startup Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="Your Company (optional)"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-white font-medium mb-2 text-sm">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 pr-12"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l-7.071 7.071M15.121 14.121L16.535 15.535m-1.414-1.414l7.071-7.071" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-white font-medium mb-2 text-sm">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l-7.071 7.071M15.121 14.121L16.535 15.535m-1.414-1.414l7.071-7.071" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    className="mt-1 w-4 h-4 text-purple-600 bg-white/5 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-300 leading-relaxed">
                    I agree to the{" "}
                    <Link href="#" className="text-purple-400 hover:text-purple-300 underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-purple-400 hover:text-purple-300 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="subscribeToUpdates"
                    name="subscribeToUpdates"
                    checked={formData.subscribeToUpdates}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-purple-600 bg-white/5 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="subscribeToUpdates" className="text-sm text-gray-300">
                    Send me product updates and tips for subscription management
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gradient text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Start Free Trial"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center text-sm">
                <span className="text-gray-400">Already have an account? </span>
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  Sign in here
                </Link>
              </div>
            </form>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No Credit Card Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Features & Benefits */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-l border-white/10">
          <div className="flex flex-col justify-center px-12 py-16">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Why Pakistani Entrepreneurs Choose <span className="heading-gradient">SubFlow</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Built by founders who understand the challenges of managing subscriptions on a startup budget.
              </p>
            </div>

            <div className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <div className="card-glass p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="Pakistani entrepreneur"
                    fill
                    className="rounded-full object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="text-white font-semibold">Ahmed Hassan</div>
                  <div className="text-purple-400 text-sm">Tech Startup Founder</div>
                </div>
              </div>
              <blockquote className="text-gray-300 italic leading-relaxed">
                "SubFlow helped us save over PKR 50,000 monthly by identifying unused subscriptions and optimizing our tool stack. Game changer for Pakistani startups!"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}