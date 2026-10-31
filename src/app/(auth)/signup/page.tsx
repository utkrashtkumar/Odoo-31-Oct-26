"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Building, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time password validation policy:
  // "more than eight characters, with an uppercase letter, a lowercase letter and a special character"
  const hasMinLength = password.length > 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMsg("Please satisfy all password complexity criteria below.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, company }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Signup failed. Please try again.");
      } else {
        signIn(data.user.email, data.user.role, data.user.name, data.user.company);
        window.location.href = "/portal";
      }
    } catch {
      setErrorMsg("Network error connecting to authentication service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand App Logo */}
        <div className="w-12 h-12 bg-odoo-purple text-white font-bold rounded-2xl flex items-center justify-center text-xl mx-auto shadow-md">
          O
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
          Create Odoo Account
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Create a business account to manage your subscriptions online
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
              <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Business / Company Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Enterprises Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Business Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple text-xs"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Rule: Each email can belong to only one account.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Create complex password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple text-xs font-mono"
                />
              </div>
            </div>

            {/* Real-time Password Complexity Checklist */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5 text-[11px]">
              <span className="font-bold text-gray-700 block text-[10px] uppercase tracking-wider">
                Password Requirements:
              </span>
              <div className="flex items-center space-x-1.5">
                {hasMinLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-300" />
                )}
                <span className={hasMinLength ? "text-emerald-700 font-semibold" : "text-gray-500"}>
                  More than 8 characters long ({password.length}/9+)
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {hasUpperCase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-300" />
                )}
                <span className={hasUpperCase ? "text-emerald-700 font-semibold" : "text-gray-500"}>
                  At least one uppercase letter (A–Z)
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {hasLowerCase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-300" />
                )}
                <span className={hasLowerCase ? "text-emerald-700 font-semibold" : "text-gray-500"}>
                  At least one lowercase letter (a–z)
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {hasSpecialChar ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-300" />
                )}
                <span className={hasSpecialChar ? "text-emerald-700 font-semibold" : "text-gray-500"}>
                  At least one special character (!@#$%^&amp;*...)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-full bg-odoo-purple hover:bg-odoo-purple-dark disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition active:scale-95 flex items-center justify-center space-x-2 text-xs"
            >
              <span>{isLoading ? "Creating Account..." : "Sign Up & Access Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Already have an account?{" "}
            <Link href="/signin" className="text-odoo-purple hover:underline font-bold">
              Sign in here ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

