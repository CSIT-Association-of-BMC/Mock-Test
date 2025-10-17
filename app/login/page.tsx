"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
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
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {mode === "login"
                ? "Sign in to access your dashboard"
                : "Join us to start your preparation journey"}
            </p>
          </div>

          <div className="flex mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 font-semibold ${
                mode === "login"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 font-semibold ${
                mode === "register"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority College
                </label>
                <input
                  type="text"
                  value={formData.priorityCollege}
                  onChange={(e) =>
                    handleInputChange("priorityCollege", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Butwal Multiple Campus"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How Did You Hear About Us?
                </label>
                <select
                  value={formData.howHeard}
                  onChange={(e) =>
                    handleInputChange("howHeard", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="friend">Friend/Word of Mouth</option>
                  <option value="social-media">Social Media</option>
                  <option value="google">Google Search</option>
                  <option value="teacher">Teacher/School</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {formData.howHeard === "other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.howHeardOther}
                    onChange={(e) =>
                      handleInputChange("howHeardOther", e.target.value)
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="How did you hear about us?"
                  />
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
