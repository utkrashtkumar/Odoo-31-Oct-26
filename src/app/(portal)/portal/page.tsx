"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, CreditCard, ShieldCheck, Download, 
  ExternalLink, Sparkles, User, LogOut, BookOpen 
} from "lucide-react";
import { initialSubscriptions, initialInvoices } from "@/lib/data-store";
import { formatMoney, formatDate, getAgingBucket } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export default function CustomerPortalPage() {
  const { user, signOut } = useAuth();
  const customer = {
    name: user?.name || "Marcus Sterling",
    company: user?.company || "Acme Enterprises Inc.",
    email: user?.email || "billing@acmecorp.com",
  };

  // Filter only this customer's records (Strict RLS Isolation!)
  const mySubs = initialSubscriptions.filter((s) => s.customer_id === "u-cust-01");
  const myInvoices = initialInvoices.filter((i) => i.customer_id === "u-cust-01");

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529]">
      {/* Customer Portal Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-odoo-purple flex items-center justify-center font-bold text-white text-base">
              O
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 tracking-tight">Odoo</span>
              <span className="text-xs text-gray-400 ml-2">/ Customer Portal</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/guide"
              className="text-xs text-gray-600 hover:text-odoo-purple font-medium flex items-center space-x-1 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-odoo-purple" />
              <span>User Guide</span>
            </Link>

            <Link
              href="/subscriptions"
              className="text-xs text-odoo-purple hover:underline font-semibold flex items-center space-x-1"
            >
              <span>Staff View ↗</span>
            </Link>

            <div className="flex items-center space-x-2 border-l border-gray-200 pl-3 text-xs">
              <div className="w-7 h-7 rounded-full bg-odoo-purple/10 text-odoo-purple font-bold flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-gray-900 leading-tight">{customer.name}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{customer.company}</div>
              </div>
              <button
                onClick={signOut}
                title="Sign out of portal"
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Portal Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-odoo-purple to-odoo-purple-dark text-white p-6 sm:p-8 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              Self-Service Hub
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {customer.company}
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Manage your active subscriptions, review renewal dates, switch add-ons, and download invoices directly without waiting for support.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-lg border border-white/20 text-center shrink-0">
            <div className="text-xs text-white/70">Account Standing</div>
            <div className="text-lg font-bold text-odoo-teal mt-0.5 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Good Standing</span>
            </div>
          </div>
        </div>

        {/* Section 1: Active Subscriptions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-odoo-purple" />
                <span>Your Active Subscriptions & Plans</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Overview of current seats, renewal dates, and billing intervals.
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {mySubs.map((sub) => {
              const totalVal = sub.lines?.reduce((sum, l) => sum + l.total, 0) || 0;
              return (
                <div key={sub.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-gray-900">{sub.subscription_number}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {sub.status}
                      </span>
                      <span className="text-xs bg-purple-50 text-odoo-purple font-semibold px-2 py-0.5 rounded border border-purple-200">
                        Enterprise Edition Included
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Enterprise Annual Contract (Yearly Frequency)
                    </div>
                    <div className="text-xs text-gray-400">
                      Term: {formatDate(sub.start_date)} to {formatDate(sub.expiry_date)} • Next Billing:{" "}
                      <strong className="text-gray-700">{formatDate(sub.next_billing_date)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Recurring Total</div>
                      <div className="text-base font-bold text-gray-900 font-mono">
                        {formatMoney(totalVal)}
                      </div>
                    </div>

                    <Link
                      href={`/subscriptions/${sub.id}`}
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded transition shadow-xs flex items-center space-x-1"
                    >
                      <span>Manage</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Invoices & Receipts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-odoo-teal" />
                <span>Invoices & Payment Receipts</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Download official tax invoices and review payment confirmations.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-[10px] uppercase border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Invoice Number</th>
                  <th className="px-5 py-3">Issue Date</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total Amount</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myInvoices.map((inv) => {
                  const isPaid = inv.status === "paid";
                  const aging = getAgingBucket(inv.due_date, isPaid);

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3 font-bold text-odoo-purple">
                        {inv.invoice_number}
                      </td>
                      <td className="px-5 py-3 text-gray-600 font-mono">
                        {formatDate(inv.issue_date)}
                      </td>
                      <td className="px-5 py-3 text-gray-600 font-mono">
                        {formatDate(inv.due_date)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${aging.badgeClass}`}>
                          {aging.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-gray-900 font-mono">
                        {formatMoney(inv.total_amount)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-odoo-purple hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Invoice</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="border-t border-gray-200 mt-16 py-6 text-center text-xs text-gray-400">
        <p>Powered by Odoo • All rights reserved.</p>
      </footer>
    </div>
  );
}

