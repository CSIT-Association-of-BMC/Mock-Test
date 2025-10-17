"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Mail,
  Lock,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    priorityCollege: "",
    howHeard: "",
    howHeardOther: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            // User is already logged in, redirect to dashboard
            router.push("/dashboard");
            return;
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: "user",
        }),
      });

      if (response.ok) {
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent("authChange"));
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (_err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.howHeard === "other" && !formData.howHeardOther.trim()) {
      setError("Please specify how you heard about us");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent("authChange"));
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
      }
    } catch (_err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formContent =
    mode === "login" ? (
      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white text-sm"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    ) : (
      <form onSubmit={handleRegister} className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white text-sm"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white text-sm"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority College
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.priorityCollege}
              onChange={(e) =>
                handleInputChange("priorityCollege", e.target.value)
              }
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white text-sm"
              placeholder="e.g. Butwal Multiple Campus"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How Did You Hear About Us?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={formData.howHeard}
              onChange={(e) => handleInputChange("howHeard", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white appearance-none text-sm"
            >
              <option value="">Select an option</option>
              <option value="friend">Friend/Word of Mouth</option>
              <option value="social-media">Social Media</option>
              <option value="google">Google Search</option>
              <option value="teacher">Teacher/School</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        {formData.howHeard === "other" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Please specify <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.howHeardOther}
              onChange={(e) =>
                handleInputChange("howHeardOther", e.target.value)
              }
              required
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-gray-50/50 hover:bg-white text-sm"
              placeholder="How did you hear about us?"
            />
          </div>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/8 rounded-full blur-lg animate-pulse delay-500"></div>

      {/* Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white rounded-sm shadow-2xl border border-gray-200 p-8 flex flex-col items-center gap-6 max-w-sm mx-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {mode === "login"
                  ? "Signing you in..."
                  : "Creating your account..."}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Please wait while we process your request
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-sm shadow-2xl border border-white/20 p-6 relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              {/* Logo/Brand */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-sm mb-3">
                  <Image
                    src="https://res.cloudinary.com/dol8m5gx7/image/upload/v1723191383/logohero_nsqj8h.png"
                    alt="CSITABMC Logo"
                    width={24}
                    height={24}
                    className="rounded-lg"
                  />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  {mode === "login" ? "Welcome Back" : "Join Our Community"}
                </h1>
                <p className="text-gray-600 text-sm">
                  {mode === "login"
                    ? "Continue your preparation journey"
                    : "Start your CSIT entrance exam preparation"}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-gray-50 rounded-sm p-1 mb-6">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2 px-3 rounded-sm font-semibold text-sm transition-all duration-300 ${
                    mode === "login"
                      ? "bg-white text-primary shadow-sm transform scale-[0.98]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Login
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`flex-1 py-2 px-3 rounded-sm font-semibold text-sm transition-all duration-300 ${
                    mode === "register"
                      ? "bg-white text-primary shadow-sm transform scale-[0.98]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Register
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  {error}
                </div>
              )}

              {formContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
