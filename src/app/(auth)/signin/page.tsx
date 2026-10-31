"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, switchRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Authentication failed. Please verify your credentials.");
      } else {
        signIn(data.user.email, data.user.role, data.user.name);
        if (data.user.role === "customer") {
          router.push("/portal");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setErrorMsg("Network or server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotMsg(data.message || "Reset link dispatched.");
    } catch {
      setForgotMsg("Error sending reset instructions.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand App Badge */}
        <div className="w-12 h-12 bg-odoo-purple text-white font-bold rounded-2xl flex items-center justify-center text-xl mx-auto shadow-md">
          B
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
          Sign in to Brightloop
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Secure Enterprise Authentication
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-xl sm:px-10 border border-gray-200 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgot(!showForgot)}
                  className="text-[11px] text-odoo-purple hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition active:scale-95 flex items-center justify-center space-x-2 text-xs"
            >
              <span>{isLoading ? "Signing in..." : "Sign in to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="border-t border-gray-100 pt-5">
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
              Fast 1-Click Role Switcher
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => switchRole("admin")}
                className="p-2 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-odoo-purple rounded text-[11px] font-bold text-center transition flex flex-col items-center"
              >
                <UserCheck className="w-4 h-4 mb-0.5" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole("staff")}
                className="p-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded text-[11px] font-bold text-center transition flex flex-col items-center"
              >
                <ShieldCheck className="w-4 h-4 mb-0.5" />
                <span>Sales Staff</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole("customer")}
                className="p-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold text-center transition flex flex-col items-center"
              >
                <UserCheck className="w-4 h-4 mb-0.5" />
                <span>Customer</span>
              </button>
            </div>
          </div>

          {/* Forgot Password Section */}
          {showForgot && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-3 animate-in fade-in">
              <span className="font-bold text-gray-900 block">Password Reset Link</span>
              <p className="text-gray-500 text-[11px]">
                Enter your registered email address to receive password reset instructions.
              </p>
              {forgotMsg ? (
                <div className="text-emerald-700 bg-emerald-50 p-2 rounded text-[11px] font-semibold border border-emerald-200">
                  {forgotMsg}
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-1.5 rounded text-xs transition"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-odoo-purple hover:underline font-bold">
              Sign up as a new customer ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

