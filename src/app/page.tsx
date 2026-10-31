"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Lock, Mail, ArrowRight, UserCheck, ShieldCheck, AlertCircle, 
  CheckCircle2, User, Building, FileText, CreditCard, BarChart3, 
  Package, Layers, Percent, ExternalLink, ChevronDown, Eye, EyeOff,
  BookOpen, Sparkles, Check, Zap, HelpCircle, ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function StartPage() {
  const { user, role, signIn, signOut, switchRole } = useAuth();

  // Active Tab: "signin" | "signup"
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up form states
  const [signUpName, setSignUpName] = useState("");
  const [signUpCompany, setSignUpCompany] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Forgot password inline state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  // Real-time password validation indicators
  const hasMinLength = signUpPassword.length > 8;
  const hasUpperCase = /[A-Z]/.test(signUpPassword);
  const hasLowerCase = /[a-z]/.test(signUpPassword);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(signUpPassword);
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);
    setSignInError(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        setSignInError(data.error || "Authentication failed. Please verify your credentials.");
      } else {
        signIn(data.user.email, data.user.role, data.user.name, data.user.company);
        window.location.href = data.user.role === "customer" ? "/portal" : "/dashboard";
      }
    } catch {
      setSignInError("Network or server connection error.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setSignUpError("Password does not meet all 4 complexity requirements.");
      return;
    }

    setSignUpLoading(true);
    setSignUpError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName.trim(),
          company: signUpCompany.trim(),
          email: signUpEmail.trim(),
          password: signUpPassword,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setSignUpError(data.error || "Signup failed. Please try again.");
      } else {
        signIn(data.user.email, data.user.role, data.user.name, data.user.company);
        window.location.href = "/portal";
      }
    } catch {
      setSignUpError("Network error connecting to authentication service.");
    } finally {
      setSignUpLoading(false);
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

  const apps = [
    {
      title: "Subscriptions Pipeline",
      desc: "Manage quotes, active contracts, auto-close rules, and brand editions.",
      href: "/subscriptions",
      icon: FileText,
      badge: "Pipeline Engine",
      color: "bg-purple-600",
    },
    {
      title: "Invoicing & Billing Day",
      desc: "Automated recurring invoices, tax calculations, payments, and overdue aging.",
      href: "/invoices",
      icon: CreditCard,
      badge: "Zero Double-Billing",
      color: "bg-teal-600",
    },
    {
      title: "Finance Lead Dashboard",
      desc: "Answers MRR, cash collected, amounts owed, and overdue receivables in < 0.2s.",
      href: "/dashboard",
      icon: BarChart3,
      badge: "Sub-2s SLA",
      color: "bg-rose-600",
    },
    {
      title: "Customer Self-Service Portal",
      desc: "Direct self-service hub for clients to view contracts, toggle add-ons, and pay bills.",
      href: "/portal",
      icon: ExternalLink,
      badge: "Self-Service",
      color: "bg-slate-700",
    },
    {
      title: "Products & Brand Variants",
      desc: "Catalog with cost/sales pricing and Enterprise Edition (+$560 surcharge).",
      href: "/products",
      icon: Package,
      badge: "Variant Matrix",
      color: "bg-blue-600",
    },
    {
      title: "Pricing Plans & Lifecycle",
      desc: "Daily, weekly, monthly, and yearly intervals with auto-close/pause rules.",
      href: "/plans",
      icon: Layers,
      badge: "Intervals",
      color: "bg-indigo-600",
    },
    {
      title: "Discount Rules Engine",
      desc: "Admin-only percentage/fixed discounts with limits and date window controls.",
      href: "/discounts",
      icon: Percent,
      badge: "Admin Only",
      color: "bg-emerald-600",
    },
    {
      title: "Automated Tax Rules",
      desc: "Admin tax rate engines applied automatically to each invoice line item.",
      href: "/taxes",
      icon: ShieldCheck,
      badge: "Auto Taxes",
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FA] text-[#212529] flex flex-col justify-between selection:bg-purple-200">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#5B3953] via-[#714B67] to-[#56384E] text-white shadow-sm sticky top-0 z-40 border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white text-base shadow-xs">
              O
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">Odoo</span>
              <span className="hidden sm:inline-block text-[11px] bg-black/20 text-white/80 px-2 py-0.5 rounded font-mono ml-2">
                Subscriptions & Billing
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Link
              href="/guide"
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-1.5 rounded-lg transition border border-white/20 flex items-center space-x-1.5 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-odoo-teal" />
              <span>User Guide</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
                <span className="hidden md:inline text-white/80">
                  Hi, <strong>{user.name.split(" ")[0]}</strong> ({role})
                </span>
                <Link
                  href={role === "customer" ? "/portal" : "/dashboard"}
                  className="bg-odoo-teal hover:bg-odoo-teal-dark text-white font-semibold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center space-x-1"
                >
                  <span>{role === "customer" ? "Customer Portal" : "Dashboard"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={signOut}
                  className="text-white/70 hover:text-white px-2 py-1 text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    setActiveTab("signin");
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    activeTab === "signin" ? "bg-white text-odoo-purple" : "text-white/80 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab("signup");
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    activeTab === "signup" ? "bg-white text-odoo-purple" : "bg-white/15 hover:bg-white/25 text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-odoo-purple-subtle text-odoo-purple px-3 py-1 rounded-full text-xs font-bold border border-odoo-purple/20">
            <Sparkles className="w-3.5 h-3.5 text-odoo-purple" />
            <span>Modern Recurring Revenue Management Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Enterprise Subscription &amp; Billing Automation
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
            Manage quotes, contract lifecycles, automated billing runs with zero duplicate charges, and client self-service in one unified platform.
          </p>
        </div>

        {/* Central Authentication Card */}
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden ring-1 ring-black/5">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 bg-gray-100/80 p-1.5 border-b border-gray-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setSignInError(null);
              }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-2 ${
                activeTab === "signin"
                  ? "bg-white text-odoo-purple shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to Account</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setSignUpError(null);
              }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-2 ${
                activeTab === "signup"
                  ? "bg-white text-odoo-purple shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Create Account (Sign Up)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: SIGN IN FORM */}
            {activeTab === "signin" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {signInError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-odoo-purple focus:ring-2 focus:ring-odoo-purple/20 bg-gray-50/50 hover:bg-white transition text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(!showForgot)}
                        className="text-odoo-purple text-[11px] font-semibold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-odoo-purple focus:ring-2 focus:ring-odoo-purple/20 bg-gray-50/50 hover:bg-white transition text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
                  >
                    <span>{signInLoading ? "Signing In..." : "Sign In to Platform"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* 1-Click Fast Role Sign-in */}
                <div className="border-t border-gray-100 pt-5">
                  <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
                    Fast 1-Click Role Switcher (Instant Evaluation)
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => switchRole("admin")}
                      className="p-3 border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-odoo-purple rounded-xl text-left transition flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between">
                        <ShieldCheck className="w-4 h-4 text-purple-700" />
                        <span className="text-[10px] bg-purple-200/60 px-1.5 py-0.2 rounded font-bold text-purple-800">Admin</span>
                      </div>
                      <div className="mt-2 font-bold text-xs text-gray-900 group-hover:text-odoo-purple">Alex Vance</div>
                      <div className="text-[10px] text-gray-500">Finance KPI</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => switchRole("staff")}
                      className="p-3 border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-800 rounded-xl text-left transition flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between">
                        <UserCheck className="w-4 h-4 text-blue-700" />
                        <span className="text-[10px] bg-blue-200/60 px-1.5 py-0.2 rounded font-bold text-blue-800">Staff</span>
                      </div>
                      <div className="mt-2 font-bold text-xs text-gray-900 group-hover:text-blue-900">Sarah Jenkins</div>
                      <div className="text-[10px] text-gray-500">Contracts</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => switchRole("customer")}
                      className="p-3 border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 rounded-xl text-left transition flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between">
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.2 rounded font-bold text-emerald-800">Client</span>
                      </div>
                      <div className="mt-2 font-bold text-xs text-gray-900 group-hover:text-emerald-900">Acme Corp</div>
                      <div className="text-[10px] text-gray-500">Customer Portal</div>
                    </button>
                  </div>
                </div>

                {/* Inline Forgot Password */}
                {showForgot && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2 animate-in fade-in">
                    <span className="font-bold text-gray-900 block text-xs">Send Password Recovery Instructions</span>
                    {forgotMsg ? (
                      <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded-lg text-xs font-semibold border border-emerald-200">
                        {forgotMsg}
                      </div>
                    ) : (
                      <form onSubmit={handleForgotSubmit} className="space-y-2">
                        <input
                          type="email"
                          required
                          placeholder="Your registered email address"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        />
                        <button
                          type="submit"
                          className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-lg text-xs transition"
                        >
                          Send Recovery Link
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SIGN UP FORM */}
            {activeTab === "signup" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {signUpError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Sterling"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-odoo-purple focus:ring-2 focus:ring-odoo-purple/20 bg-gray-50/50 hover:bg-white transition text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company / Organization *</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Corporation"
                        value={signUpCompany}
                        onChange={(e) => setSignUpCompany(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-odoo-purple focus:ring-2 focus:ring-odoo-purple/20 bg-gray-50/50 hover:bg-white transition text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Business Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="name@business.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-odoo-purple focus:ring-2 focus:ring-odoo-purple/20 bg-gray-50/50 hover:bg-white transition text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSignUpPassword ? "text" : "password"}
                        required
                        placeholder="Create strong password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-odoo-purple focus:ring-2 focus:ring-odoo-purple/20 bg-gray-50/50 hover:bg-white transition text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Live Password Complexity Meter */}
                    <div className="mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-[11px]">
                      <span className="font-bold text-gray-700 block text-[10px] uppercase tracking-wider">
                        Security Requirements:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className={`flex items-center space-x-1.5 transition ${hasMinLength ? "text-emerald-700 font-bold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>&gt; 8 characters</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition ${hasUpperCase ? "text-emerald-700 font-bold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpperCase ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>Uppercase letter</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition ${hasLowerCase ? "text-emerald-700 font-bold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasLowerCase ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>Lowercase letter</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition ${hasSpecialChar ? "text-emerald-700 font-bold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecialChar ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>Special character</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signUpLoading || !isPasswordValid}
                    className="w-full bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
                  >
                    <span>{signUpLoading ? "Creating Account..." : "Create Account & Enter Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Interactive "How to Use Me" Quick Guide Section */}
        <section className="mt-14 w-full max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-odoo-purple" />
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  How to Use the System (Interactive Guide)
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Quick-start instructions to test quotes, subscriptions, billing runs, and payments.
              </p>
            </div>
            <Link
              href="/guide"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-odoo-purple hover:text-odoo-purple-dark bg-odoo-purple-subtle px-3 py-1.5 rounded-lg border border-odoo-purple/20 transition self-start sm:self-auto"
            >
              <span>Read Full Documentation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-odoo-purple/40 transition">
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">Step 1</span>
              <h3 className="font-bold text-sm text-gray-900">Quotation to Contract</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Open <Link href="/subscriptions" className="text-odoo-purple font-semibold hover:underline">Subscriptions</Link>, create a quote from template, select the Enterprise Edition variant (+$560), and advance to Active.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-odoo-purple/40 transition">
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase">Step 2</span>
              <h3 className="font-bold text-sm text-gray-900">⚡ Run Billing Day</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Click <strong>&quot;Run Billing Day&quot;</strong> in the top header. The idempotent billing engine auto-generates recurring invoices without double-billing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-odoo-purple/40 transition">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">Step 3</span>
              <h3 className="font-bold text-sm text-gray-900">Pay &amp; Reconcile</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Open any Confirmed invoice in <Link href="/invoices" className="text-odoo-purple font-semibold hover:underline">Invoices</Link>, click <strong>&quot;Register Payment&quot;</strong> to record payments and update balances.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-odoo-purple/40 transition">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">Step 4</span>
              <h3 className="font-bold text-sm text-gray-900">Executive Dashboard</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Open <Link href="/dashboard" className="text-odoo-purple font-semibold hover:underline">Dashboard</Link> to review MRR, cash collected, amounts owed, and 1-Click Overdue Chaser.
              </p>
            </div>
          </div>
        </section>

        {/* Enterprise Apps & Modules Section */}
        <section id="modules" className="mt-14 w-full max-w-5xl">
          <div className="pb-4 border-b border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Enterprise Apps Suite
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Launch and explore all integrated modules directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <Link
                  key={app.title}
                  href={app.href}
                  className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-odoo-purple hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`w-10 h-10 rounded-xl ${app.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {app.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-gray-900 group-hover:text-odoo-purple transition">
                      {app.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {app.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-odoo-purple group-hover:underline">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400 bg-white mt-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-gray-500 font-semibold">
            <span>Odoo Subscription Management System</span>
            <span className="text-gray-300">•</span>
            <Link href="/guide" className="text-odoo-purple hover:underline">User Guide</Link>
          </div>
          <p>© 2026 Odoo S.A. • Enterprise Invoicing &amp; Recurring Billing</p>
        </div>
      </footer>
    </div>
  );
}
