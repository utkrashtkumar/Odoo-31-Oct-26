"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, Play, CheckCircle2, ShieldCheck, UserCheck, 
  CreditCard, FileText, BarChart3, Package, ArrowRight, 
  Sparkles, Layers, Zap, Clock, ExternalLink, HelpCircle,
  Calculator, PenTool, AlertTriangle 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/lib/auth-context";

export default function GuidePage() {
  const { switchRole } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("quickstart");

  const sections = [
    { id: "quickstart", title: "1. Quickstart & Roles", icon: UserCheck },
    { id: "subscriptions", title: "2. Quotation & Subscriptions", icon: FileText },
    { id: "billing", title: "3. Billing Day Engine", icon: Zap },
    { id: "invoicing", title: "4. Invoices & Payments", icon: CreditCard },
    { id: "dashboard", title: "5. Finance Executive KPI", icon: BarChart3 },
    { id: "portal", title: "6. Customer Self-Service", icon: ExternalLink },
    { id: "proration_esign", title: "7. Proration & E-Signing", icon: PenTool },
    { id: "sandbox_dunning", title: "8. Gateway & Dunning", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#212529]">
      <Navbar currentApp="System User Guide" />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-odoo-purple to-odoo-purple-dark text-white py-12 px-4 shadow-md">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90 border border-white/20">
            <BookOpen className="w-3.5 h-3.5 text-odoo-teal" />
            <span>Interactive Operational Guide & Architecture Reference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How to Use the Odoo Subscription System
          </h1>
          <p className="text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Follow this step-by-step walkthrough to explore subscription lifecycles, automated billing runs, real-time financial reconciliation, and customer self-service.
          </p>

          {/* Instant Role Jumpers */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-xs text-white/70 mr-1">Instant Demo Switch:</span>
            <button
              onClick={() => switchRole("admin")}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Login as Admin</span>
            </button>
            <button
              onClick={() => switchRole("staff")}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Login as Staff</span>
            </button>
            <button
              onClick={() => switchRole("customer")}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Login as Customer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sticky Navigation */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs sticky top-20">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-3 py-2">
              Guide Chapters
            </span>
            <div className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition ${
                      isActive
                        ? "bg-odoo-purple text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 px-3">
              <span className="text-[11px] font-bold text-gray-700 block mb-1">Global Shortcut:</span>
              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200 font-mono">
                <span>Command Palette</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-gray-300 text-[10px] font-bold">⌘K</kbd>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Section Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* SECTION 1: QUICKSTART & ROLES */}
          {activeSection === "quickstart" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-odoo-purple uppercase tracking-wider bg-odoo-purple-subtle px-2.5 py-1 rounded-md">
                  Chapter 1
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  System Architecture & User Roles
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  The Odoo Subscription Management System supports multi-role Role-Based Access Control (RBAC) connecting to cloud authentication and PostgreSQL.
                </p>
              </div>

              {/* Roles Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                  <div className="flex items-center space-x-2 text-odoo-purple font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-purple-700" />
                    <span>Administrator</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Full executive access: Finance Dashboard, Invoicing, Plan management, Tax & Discount engines.
                  </p>
                  <div className="text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-purple-200">
                    <strong>Email:</strong> admin@odoo.com<br />
                    <strong>Password:</strong> admin123
                  </div>
                  <button
                    onClick={() => switchRole("admin")}
                    className="w-full mt-2 bg-odoo-purple hover:bg-odoo-purple-dark text-white text-xs font-bold py-1.5 rounded-lg transition"
                  >
                    Switch to Admin ➔
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
                    <UserCheck className="w-5 h-5 text-blue-700" />
                    <span>Sales Representative</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Sales operations: Create quotations, configure brand variants (+$560), activate contracts, manage add-ons.
                  </p>
                  <div className="text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-blue-200">
                    <strong>Email:</strong> sarah.rep@odoo.com<br />
                    <strong>Password:</strong> staff123
                  </div>
                  <button
                    onClick={() => switchRole("staff")}
                    className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-1.5 rounded-lg transition"
                  >
                    Switch to Staff ➔
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <UserCheck className="w-5 h-5 text-emerald-700" />
                    <span>Customer Account</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Self-service client portal: View active contracts, toggle optional add-ons, view and pay invoices.
                  </p>
                  <div className="text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-emerald-200">
                    <strong>Email:</strong> billing@acmecorp.com<br />
                    <strong>Password:</strong> customer123
                  </div>
                  <button
                    onClick={() => switchRole("customer")}
                    className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 rounded-lg transition"
                  >
                    Switch to Customer ➔
                  </button>
                </div>
              </div>

              {/* Security policy */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <h4 className="font-bold text-xs text-gray-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-odoo-teal" />
                  <span>Password Security & Unique Email Policy</span>
                </h4>
                <p className="text-xs text-gray-600">
                  New registrations require a password greater than 8 characters containing at least one uppercase letter, one lowercase letter, and one special character. Each email is strictly unique across all accounts.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: QUOTATION & SUBSCRIPTIONS */}
          {activeSection === "subscriptions" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-odoo-purple uppercase tracking-wider bg-odoo-purple-subtle px-2.5 py-1 rounded-md">
                  Chapter 2
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Quotation-to-Subscription Lifecycle
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  How contracts move seamlessly through status pipeline stages with add-on toggling and variant surcharges.
                </p>
              </div>

              {/* Sequential Chevron Pipeline Graphic */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-700 block">5-Stage Status Chevron Pipeline:</span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded">1. Draft</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-3 py-1 bg-purple-100 text-odoo-purple rounded font-bold">2. Quotation</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-bold">3. Confirmed</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded font-bold">4. Active</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded">5. Closed</span>
                </div>
              </div>

              {/* Action Steps */}
              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-odoo-purple text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-semibold text-sm">Create a Quotation from Template:</strong>
                    Go to <Link href="/subscriptions" className="text-odoo-purple font-bold hover:underline">/subscriptions</Link>, click <strong>&quot;New Quotation&quot;</strong>, and select a customer and quotation template (configured with set validity days).
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-odoo-purple text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-semibold text-sm">Configure Product Variants & Surcharges:</strong>
                    Select the <strong>Enterprise Edition</strong> variant which adds an automatic <strong>+$560.00</strong> surcharge per seat.
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-odoo-purple text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-semibold text-sm">Switchboard Add-on Toggling:</strong>
                    Open contract <Link href="/subscriptions/sub-00101" className="text-odoo-purple font-bold hover:underline">SUB-00101</Link> and toggle optional add-ons (like Recurring Billing Engine, $49/mo) on or off dynamically.
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-odoo-purple text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    4
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-semibold text-sm">Audit Trail in Collaboration Chatter:</strong>
                    Every status progression and note is automatically appended to the real-time Chatter stream at the bottom of the order.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/subscriptions"
                  className="inline-flex items-center space-x-2 bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>Open Subscriptions Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* SECTION 3: BILLING DAY ENGINE */}
          {activeSection === "billing" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-odoo-purple uppercase tracking-wider bg-odoo-purple-subtle px-2.5 py-1 rounded-md">
                  Chapter 3
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Automated Billing Day & Idempotency
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  How recurring invoices are generated on billing day without accidental duplicate charges or missed cycles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-teal-900 flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-odoo-teal" />
                    <span>1-Click Live Billing Runner</span>
                  </h4>
                  <p className="text-xs text-gray-600">
                    In the top navigation bar of any page, click the <strong>&quot;⚡ Run Billing Day&quot;</strong> button to trigger the batch billing process for all active subscriptions due today.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-odoo-purple-dark flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-odoo-purple" />
                    <span>Zero Double-Billing Safeguard</span>
                  </h4>
                  <p className="text-xs text-gray-600">
                    The engine checks existing invoices for the active subscription cycle. If already billed, it logs an idempotent pass and advances the next billing date cleanly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: INVOICING & PAYMENTS */}
          {activeSection === "invoicing" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-odoo-purple uppercase tracking-wider bg-odoo-purple-subtle px-2.5 py-1 rounded-md">
                  Chapter 4
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Invoicing, Taxes & Payment Ledger
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Managing invoices from Draft to Confirmed to Paid with line-item taxes and rolling balance tracking.
                </p>
              </div>

              <div className="space-y-4 text-xs text-gray-600">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <strong className="text-gray-900 block text-sm">Registering Payments & Partial Payments:</strong>
                  <p>
                    Open invoice <Link href="/invoices/inv-2026-0001" className="text-odoo-purple font-bold hover:underline">INV/2026/0001</Link> and click <strong>&quot;Register Payment&quot;</strong>. You can enter full or partial payment amounts via Bank Transfer, Credit Card, or Cash. The system recalculates remaining balance due with arbitrary precision.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <strong className="text-gray-900 block text-sm">Automated Tax Calculation Engine:</strong>
                  <p>
                    Taxes (configured in <Link href="/taxes" className="text-odoo-purple font-bold hover:underline">/taxes</Link>) are automatically computed per line item and itemized on the invoice document.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/invoices"
                  className="inline-flex items-center space-x-2 bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>View Customer Invoices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* SECTION 5: FINANCE EXECUTIVE KPI */}
          {activeSection === "dashboard" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-odoo-purple uppercase tracking-wider bg-odoo-purple-subtle px-2.5 py-1 rounded-md">
                  Chapter 5
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Finance Lead Executive Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Answering the 4 core financial reconciliation questions in under 0.1s:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Question 1</span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">Active Subscriptions</h4>
                  <p className="text-xs text-gray-500 mt-1">Total active paying contracts and monthly recurring revenue breakdown.</p>
                </div>

                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">Question 2</span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">Revenue Collected</h4>
                  <p className="text-xs text-gray-500 mt-1">Total cleared cash received across all payments in the selected period.</p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Question 3</span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">Amount Still Owed</h4>
                  <p className="text-xs text-gray-500 mt-1">Total outstanding accounts receivable from unpaid confirmed invoices.</p>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Question 4</span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">Overdue Aging Buckets</h4>
                  <p className="text-xs text-gray-500 mt-1">Overdue receivables sorted into 1–15 days, 16–30 days, and 30+ days overdue with 1-Click automated chase reminders.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>Launch Executive Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* SECTION 6: CUSTOMER SELF-SERVICE */}
          {activeSection === "portal" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-odoo-purple uppercase tracking-wider bg-odoo-purple-subtle px-2.5 py-1 rounded-md">
                  Chapter 6
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Customer Self-Service Web Portal
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  How customers independently monitor their contracts, toggle add-ons, and download receipts.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-600">
                <p>
                  The Customer Portal at <Link href="/portal" className="text-odoo-purple font-bold hover:underline">/portal</Link> enforces strict customer data isolation:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Customers view only their own contracts and invoices.</li>
                  <li>Direct toggling of subscription add-ons without opening a support ticket.</li>
                  <li>Live payment status and PDF receipt downloading.</li>
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  href="/portal"
                  className="inline-flex items-center space-x-2 bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>Open Customer Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* SECTION 7: SMART PRORATION & DIGITAL CONTRACT E-SIGN */}
          {activeSection === "proration_esign" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-odoo-purple uppercase tracking-wider bg-odoo-purple-subtle px-2.5 py-1 rounded-md">
                  Chapter 7
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Smart Proration Engine & Digital Contract E-Sign
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Financial precision for mid-cycle seat adjustments and legally binding contract signatures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4 text-odoo-purple" />
                    <h3 className="font-bold text-sm text-gray-900">Arbitrary-Precision Proration</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Powered by <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-odoo-purple">decimal.js</code>, 
                    mid-cycle add-on toggling or seat upgrades calculate daily fractions with zero floating-point drift:
                  </p>
                  <div className="bg-white p-2.5 rounded border border-purple-200 text-[11px] font-mono text-gray-700">
                    Proration = (Monthly Price / Billing Days) × Remaining Days
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <PenTool className="w-4 h-4 text-odoo-teal" />
                    <h3 className="font-bold text-sm text-gray-900">Cryptographic E-Sign Pad</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Interactive HTML5 smooth canvas drawing and typed signature mode. Generates a timestamped token, 
                    hashes legal terms agreement, and converts Quotations to Confirmed instantly.
                  </p>
                  <div className="bg-white p-2.5 rounded border border-teal-200 text-[11px] font-mono text-gray-700">
                    Token: SIG-2026-SHA256 • IP & Audit Trail Logged
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/subscriptions/sub-00101"
                  className="inline-flex items-center space-x-2 bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>Test Proration on Subscription</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>Test Portal E-Sign Flow</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* SECTION 8: GATEWAY SANDBOX & DUNNING AUTO-RECOVERY */}
          {activeSection === "sandbox_dunning" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                  Chapter 8
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Gateway Webhook Sandbox & Dunning Escalation Engine
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Test edge-case payment gateway scenarios and automate debt collection across 3 progressive tiers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <h3 className="font-bold text-sm text-gray-900">Payment Gateway Sandbox Scenarios</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    Simulate real Stripe / Adyen / Mollie payment gateways directly from any confirmed invoice:
                  </p>
                  <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
                    <li><strong>Instant Success (200 OK):</strong> Immediate capture and real-time balance clearance.</li>
                    <li><strong>Insufficient Funds (402):</strong> Simulates bank card decline and triggers retry policy.</li>
                    <li><strong>3D Secure OTP Challenge:</strong> Interactive modal verification simulating two-factor SMS bank challenge.</li>
                    <li><strong>Fraud Filter Rejection:</strong> High-risk velocity simulation for security testing.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h3 className="font-bold text-sm text-gray-900">Automated 3-Tier Dunning Engine</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    Configurable recovery pipeline with automatic subscription action:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="bg-white p-2.5 rounded border border-yellow-200">
                      <span className="font-bold text-yellow-800 block">Tier 1 (Day 1-7)</span>
                      <span className="text-gray-500 text-[11px]">Gentle reminder email + card update link</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-orange-200">
                      <span className="font-bold text-orange-800 block">Tier 2 (Day 8-14)</span>
                      <span className="text-gray-500 text-[11px]">Urgent notice + 7-day grace period countdown</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-red-200">
                      <span className="font-bold text-red-800 block">Tier 3 (Day 15+)</span>
                      <span className="text-red-700 font-bold text-[11px]">Auto-Suspend Subscription + Legal Notice</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/dunning"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>Open Dunning Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/invoices/inv-2026-0002"
                  className="inline-flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg transition text-xs shadow-xs"
                >
                  <span>Test Gateway Sandbox on Invoice</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

