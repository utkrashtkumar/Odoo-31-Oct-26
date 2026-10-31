"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  AlertTriangle, ShieldAlert, Zap, CheckCircle2, 
  Send, UserX, Clock, ArrowRight, ShieldCheck, RefreshCw 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { initialInvoices, initialSubscriptions } from "@/lib/data-store";
import { formatMoney, formatDate, getAgingBucket } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";

export default function DunningPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [sweepResult, setSweepResult] = useState<{
    message: string;
    log: string[];
    stats: { totalEvaluated: number; remindersSent: number; accountsSuspended: number };
  } | null>(null);

  const today = new Date();

  // Find overdue invoices
  const overdueInvoices = initialInvoices
    .filter((i) => i.status !== "paid" && i.balance_due > 0 && differenceInDays(today, parseISO(i.due_date)) > 0)
    .map((inv) => {
      const daysPastDue = differenceInDays(today, parseISO(inv.due_date));
      const sub = initialSubscriptions.find((s) => s.id === inv.subscription_id);
      
      let tier = "Tier 1: Friendly Reminder";
      let tierColor = "bg-amber-100 text-amber-800 border-amber-300";
      if (daysPastDue > 30) {
        tier = "Tier 3: Grace Expired (Auto-Suspend)";
        tierColor = "bg-red-100 text-red-800 border-red-300";
      } else if (daysPastDue > 14) {
        tier = "Tier 2: Urgent Demand Notice";
        tierColor = "bg-orange-100 text-orange-800 border-orange-300";
      }

      return {
        ...inv,
        daysPastDue,
        sub,
        tier,
        tierColor,
      };
    });

  const totalDunningOwed = overdueInvoices.reduce((acc, i) => acc + i.balance_due, 0);

  const handleRunDunning = async () => {
    setIsRunning(true);
    setSweepResult(null);

    try {
      const res = await fetch("/api/billing/dunning", { method: "POST" });
      const data = await res.json();
      setSweepResult(data);
    } catch {
      setSweepResult({
        message: "Failed to trigger automated dunning engine.",
        log: ["Error connecting to dunning endpoint."],
        stats: { totalEvaluated: 0, remindersSent: 0, accountsSuspended: 0 },
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-odoo-canvas">
      <Navbar currentApp="Dunning Automation" />

      <ControlPanel
        breadcrumbs={[
          { label: "Odoo Settings", href: "/dashboard" },
          { label: "Automated Dunning & Grace Periods" },
        ]}
        customActions={
          <button
            onClick={handleRunDunning}
            disabled={isRunning}
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Executing Sweep..." : "⚡ Run Dunning Sweep"}</span>
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-odoo-border shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Overdue in Dunning
            </span>
            <div className="text-2xl font-black text-red-600 mt-1">
              {formatMoney(totalDunningOwed)}
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Across {overdueInvoices.length} active overdue accounts</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-odoo-border shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Standard Plan Grace Period
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              14 Days
            </div>
            <span className="text-[11px] text-emerald-600 mt-0.5 font-semibold block">Configured in Plan Lifecycles</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-odoo-border shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Tier 3 Critical Threshold
            </span>
            <div className="text-2xl font-black text-amber-700 mt-1">
              30 Days
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Automatic contract suspension cutoff</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-odoo-border shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Dunning Automation Status
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1 flex items-center space-x-1.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>Active</span>
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Next scheduled run: 00:05 UTC</span>
          </div>
        </div>

        {/* Sweep Results Banner */}
        {sweepResult && (
          <div className="p-5 bg-gray-900 text-white rounded-xl shadow-md border border-gray-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-emerald-300">{sweepResult.message}</h4>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                Evaluated: {sweepResult.stats.totalEvaluated} | Reminders: {sweepResult.stats.remindersSent} | Suspended: {sweepResult.stats.accountsSuspended}
              </span>
            </div>

            <div className="bg-black/50 p-3 rounded-lg font-mono text-[11px] text-emerald-400/90 space-y-1 max-h-36 overflow-y-auto">
              {sweepResult.log.map((item, idx) => (
                <div key={idx}>{item}</div>
              ))}
            </div>
          </div>
        )}

        {/* Dunning Escalation Table */}
        <div className="bg-white rounded-xl border border-odoo-border shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-odoo-border bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Escalation Matrix &amp; Accounts in Dunning</h3>
              <p className="text-xs text-gray-500">Real-time status of overdue customer balances and automated action tiers.</p>
            </div>
            <button
              onClick={handleRunDunning}
              disabled={isRunning}
              className="text-xs bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                <tr>
                  <th className="px-5 py-3">Invoice #</th>
                  <th className="px-5 py-3">Customer &amp; Company</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3 text-center">Overdue Days</th>
                  <th className="px-5 py-3 text-right">Balance Due</th>
                  <th className="px-5 py-3">Dunning Tier</th>
                  <th className="px-5 py-3">Contract Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                {overdueInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="font-bold text-gray-700">All accounts are current!</p>
                      <p className="text-xs">No overdue invoices currently requiring dunning escalation.</p>
                    </td>
                  </tr>
                ) : (
                  overdueInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3 font-bold text-odoo-purple">
                        <Link href={`/invoices/${inv.id}`} className="hover:underline">
                          {inv.invoice_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-gray-900">{inv.customer_id}</div>
                        <div className="text-[11px] text-gray-400">Linked: {inv.sub?.subscription_number || "Direct"}</div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 font-mono">
                        {formatDate(inv.due_date)}
                      </td>
                      <td className="px-5 py-3 text-center font-bold text-red-600 font-mono">
                        {inv.daysPastDue}d
                      </td>
                      <td className="px-5 py-3 text-right font-black font-mono text-gray-900">
                        {formatMoney(inv.balance_due)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${inv.tierColor}`}>
                          {inv.tier}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.sub?.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          {inv.sub?.status?.toUpperCase() || "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="text-odoo-purple hover:underline font-bold text-xs inline-flex items-center space-x-1"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

