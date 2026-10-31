"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, Mail, ArrowRight, UserCheck, ShieldCheck, AlertCircle, 
  CheckCircle2, User, Building, FileText, CreditCard, BarChart3, 
  Package, Layers, Percent, ExternalLink, ChevronDown 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function StartPage() {
  const router = useRouter();
  const { user, role, signIn, signOut, switchRole } = useAuth();

  // Active Tab: "signin" | "signup"
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up form states
  const [signUpName, setSignUpName] = useState("");
  const [signUpCompany, setSignUpCompany] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Forgot password modal / inline state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  // Show apps catalog accordion state
  const [showCatalog, setShowCatalog] = useState(false);

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
        signIn(data.user.email, data.user.role, data.user.name);
        if (data.user.role === "customer") {
          router.push("/portal");
        } else {
          router.push("/dashboard");
        }
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
      setSignUpError("Password does not satisfy all complexity requirements.");
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
        signIn(data.user.email, data.user.role, data.user.name);
        router.push("/portal");
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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between text-[#212529]">
      {/* Top Header */}
      <header className="bg-odoo-purple text-white shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white text-base">
              O
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">Odoo</span>
            <span className="hidden sm:inline-block text-[11px] bg-black/20 text-odoo-purple-subtle px-2 py-0.5 rounded font-mono">
              Subscriptions & Invoicing
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline text-white/80">
                  Signed in as <strong>{user.name}</strong> ({role})
                </span>
                <Link
                  href={role === "customer" ? "/portal" : "/dashboard"}
                  className="bg-odoo-teal hover:bg-odoo-teal-dark text-white font-semibold px-3 py-1.5 rounded transition shadow-xs flex items-center space-x-1"
                >
                  <span>{role === "customer" ? "Customer Portal" : "Enter Dashboard"}</span>
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab("signin")}
                  className={`px-3 py-1.5 rounded font-semibold transition ${
                    activeTab === "signin" ? "bg-white text-odoo-purple" : "text-white/80 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`px-3 py-1.5 rounded font-semibold transition ${
                    activeTab === "signup" ? "bg-white text-odoo-purple" : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Authentication Card & Hero */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full flex flex-col items-center">
        {/* Brand Banner */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Unified Subscription Management System
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Sign in to access your contracts, invoices, and analytics, or register a new business account.
          </p>
        </div>

        {/* Central Card with Login & Signup Options */}
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tab Selection Header */}
          <div className="grid grid-cols-2 bg-gray-100 p-1.5 border-b border-gray-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setSignInError(null);
              }}
              className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === "signin"
                  ? "bg-white text-odoo-purple shadow-xs font-extrabold"
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
              className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === "signup"
                  ? "bg-white text-odoo-purple shadow-xs font-extrabold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Create Account (Sign Up)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: SIGN IN OPTION */}
            {activeTab === "signin" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {signInError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple bg-white"
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
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold py-2.5 rounded-lg shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <span>{signInLoading ? "Verifying Credentials..." : "Sign In to Platform"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* 1-Click Fast Role Sign-in */}
                <div className="border-t border-gray-100 pt-4">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2.5">
                    Fast 1-Click Role Access (Instant Evaluation)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        switchRole("admin");
                        router.push("/dashboard");
                      }}
                      className="p-2 border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-odoo-purple rounded-lg text-[11px] font-bold text-center transition flex flex-col items-center"
                    >
                      <UserCheck className="w-4 h-4 mb-0.5 text-purple-700" />
                      <span>Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        switchRole("staff");
                        router.push("/subscriptions");
                      }}
                      className="p-2 border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-800 rounded-lg text-[11px] font-bold text-center transition flex flex-col items-center"
                    >
                      <ShieldCheck className="w-4 h-4 mb-0.5 text-blue-700" />
                      <span>Sales Staff</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        switchRole("customer");
                        router.push("/portal");
                      }}
                      className="p-2 border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold text-center transition flex flex-col items-center"
                    >
                      <UserCheck className="w-4 h-4 mb-0.5 text-emerald-700" />
                      <span>Customer</span>
                    </button>
                  </div>
                </div>

                {/* Forgot Password Displayer */}
                {showForgot && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-2 animate-in fade-in">
                    <span className="font-bold text-gray-900 block text-[11px]">Send Password Recovery Link</span>
                    {forgotMsg ? (
                      <div className="text-emerald-700 bg-emerald-50 p-2 rounded text-[11px] font-semibold border border-emerald-200">
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
                          className="w-full p-2 border border-gray-300 rounded text-xs bg-white"
                        />
                        <button
                          type="submit"
                          className="w-full bg-gray-800 hover:bg-black text-white font-bold py-1.5 rounded text-xs transition"
                        >
                          Dispatch Link
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SIGN UP OPTION */}
            {activeTab === "signup" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {signUpError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Vance"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company / Organization *</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Corporation"
                        value={signUpCompany}
                        onChange={(e) => setSignUpCompany(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Business Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="name@business.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="Create strong password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple bg-white"
                      />
                    </div>

                    {/* Live Password Complexity Meter */}
                    <div className="mt-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-lg space-y-1 text-[11px]">
                      <span className="font-bold text-gray-700 block text-[10px] uppercase tracking-wider mb-1">
                        Password Requirements:
                      </span>
                      <div className="grid grid-cols-2 gap-1">
                        <div className={`flex items-center space-x-1.5 ${hasMinLength ? "text-emerald-700 font-semibold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>&gt; 8 characters</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 ${hasUpperCase ? "text-emerald-700 font-semibold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpperCase ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>Uppercase letter</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 ${hasLowerCase ? "text-emerald-700 font-semibold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasLowerCase ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>Lowercase letter</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 ${hasSpecialChar ? "text-emerald-700 font-semibold" : "text-gray-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecialChar ? "text-emerald-600" : "text-gray-300"}`} />
                          <span>Special character</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signUpLoading || !isPasswordValid}
                    className="w-full bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold py-2.5 rounded-lg shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <span>{signUpLoading ? "Creating Account..." : "Create Account & Enter Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Explore Modules Accordion Toggle */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowCatalog(!showCatalog)}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-odoo-purple transition bg-white px-4 py-2 rounded-full border border-gray-200 shadow-2xs"
          >
            <span>{showCatalog ? "Hide Platform Modules" : "Or browse Enterprise Apps & Catalog as Guest"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCatalog ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Modules Grid (shown when expanded) */}
        {showCatalog && (
          <section className="mt-6 w-full max-w-5xl animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {apps.map((app) => {
                const Icon = app.icon;
                return (
                  <Link
                    key={app.title}
                    href={app.href}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-odoo-purple hover:shadow-sm transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-lg ${app.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
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

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-odoo-purple group-hover:underline">
                      <span>Launch App</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 bg-white">
        <p>Odoo Subscription Management System • Enterprise Billing & Invoicing</p>
      </footer>
    </div>
  );
}
