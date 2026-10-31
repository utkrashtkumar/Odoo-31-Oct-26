"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { StatusPipeline } from "@/components/common/StatusPipeline";
import { Chatter } from "@/components/common/Chatter";
import { HealthScoreBadge } from "@/components/common/HealthScoreBadge";
import { CommandPalette } from "@/components/common/CommandPalette";
import { 
  initialSubscriptions, initialActivityLogs 
} from "@/lib/data-store";
import { formatMoney, formatDate } from "@/lib/utils";
import { SubscriptionStatus } from "@/types";
import { 
  Check, Play, Pause, XCircle, RotateCcw, 
  FileText, ShieldCheck, ToggleLeft, ToggleRight
} from "lucide-react";

export default function SubscriptionDetailPage({ params }: { params: { id: string } }) {
  const sub = initialSubscriptions.find((s) => s.id === params.id) || initialSubscriptions[0];

  const [currentStatus, setCurrentStatus] = useState<SubscriptionStatus>(sub.status);
  const [hasAddon, setHasAddon] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const stages: { id: SubscriptionStatus; label: string }[] = [
    { id: "draft", label: "Draft" },
    { id: "quotation", label: "Quotation" },
    { id: "confirmed", label: "Confirmed" },
    { id: "active", label: "Active" },
    { id: "closed", label: "Closed" },
  ];

  const handleStageChange = (newStage: SubscriptionStatus) => {
    setCurrentStatus(newStage);
    sub.status = newStage;
    setStatusMsg(`Status updated to ${newStage.toUpperCase()}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleToggleAddon = () => {
    setHasAddon((prev) => !prev);
    setStatusMsg(!hasAddon ? "Add-on enabled. Pro-rated billing scheduled." : "Add-on removed.");
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const lines = sub.lines || [];
  const subtotal = lines.reduce((acc, l) => acc + l.subtotal, 0);
  const taxTotal = lines.reduce((acc, l) => acc + (l.total - l.subtotal), 0);
  const totalAmount = subtotal + taxTotal;

  return (
    <div className="min-h-screen bg-odoo-canvas pb-12">
      <Navbar currentApp="Subscriptions" />

      <ControlPanel
        breadcrumbs={[
          { label: "Brightloop Subscriptions", href: "/subscriptions" },
          { label: sub.subscription_number },
        ]}
        customActions={
          statusMsg && (
            <span className="text-xs bg-odoo-teal text-white px-2.5 py-1 rounded shadow-xs font-semibold animate-in fade-in">
              {statusMsg}
            </span>
          )
        }
      />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Odoo Form Action Bar & Pipeline Stage Bar */}
        <div className="bg-white p-3 rounded-t-lg border border-odoo-border border-b-0 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {currentStatus === "draft" && (
              <button
                onClick={() => handleStageChange("quotation")}
                className="bg-odoo-purple hover:bg-odoo-purple-dark text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition"
              >
                Send Quotation
              </button>
            )}

            {currentStatus === "quotation" && (
              <button
                onClick={() => handleStageChange("confirmed")}
                className="bg-odoo-purple hover:bg-odoo-purple-dark text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Offer</span>
              </button>
            )}

            {currentStatus === "confirmed" && (
              <button
                onClick={() => handleStageChange("active")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Activate Subscription</span>
              </button>
            )}

            {currentStatus === "active" && (
              <>
                <button
                  onClick={() => handleStageChange("paused")}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
                  title="Pause subscription if plan permits"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={() => handleStageChange("closed")}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
                  title="Close subscription early"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Close Early</span>
                </button>
              </>
            )}

            {currentStatus === "paused" && (
              <button
                onClick={() => handleStageChange("active")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Subscription</span>
              </button>
            )}

            {currentStatus === "closed" && (
              <button
                onClick={() => handleStageChange("active")}
                className="bg-odoo-purple hover:bg-odoo-purple-dark text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Renew Contract</span>
              </button>
            )}

            <Link
              href="/invoices"
              className="bg-white border border-odoo-border hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              <span>Invoices (1)</span>
            </Link>
          </div>

          {/* Odoo Chevron Status Pipeline (Top Right) */}
          <StatusPipeline
            stages={stages}
            currentStage={currentStatus}
            onStageClick={handleStageChange}
          />
        </div>

        {/* Odoo Form Sheet Container */}
        <div className="odoo-sheet rounded-b-lg p-6 sm:p-8 space-y-6">
          {/* Header Title with Number & Health Gauge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-odoo-border gap-2">
            <div>
              <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Subscription Order
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center space-x-3">
                <span>{sub.subscription_number}</span>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded border border-gray-200">
                  {sub.payment_terms}
                </span>
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <HealthScoreBadge score={sub.health_score} label={sub.health_label} />
            </div>
          </div>

          {/* Field Details Grid (PDF Specification) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Customer Account:</span>
                <span className="font-bold text-gray-900">
                  {sub.id === "sub-00101" ? "Acme Enterprises Inc." : "Corner Bakery & Cafe"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Pricing Plan:</span>
                <span className="font-medium text-odoo-purple">
                  Enterprise Annual Contract (Yearly)
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Payment Terms:</span>
                <span className="text-gray-800">{sub.payment_terms}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Start Date:</span>
                <span className="text-gray-800">{formatDate(sub.start_date)}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Expiry Date:</span>
                <span className="text-gray-800">{formatDate(sub.expiry_date)}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Next Billing Day:</span>
                <span className="font-bold text-odoo-teal">{formatDate(sub.next_billing_date)}</span>
              </div>
            </div>
          </div>

          {/* Add-on Switchboard Section (PDF: "add-ons customers switch on and off") */}
          <div className="bg-odoo-purple-subtle/50 border border-odoo-purple/20 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-odoo-purple" />
              <div>
                <span className="font-bold text-xs text-odoo-purple-dark">
                  Recurring Add-on: Automated Invoicing Engine (+$49/mo)
                </span>
                <p className="text-[11px] text-gray-500">
                  Customers or staff can switch this add-on on/off with instant billing cycle update.
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleAddon}
              className="flex items-center space-x-1.5 text-xs font-semibold text-odoo-purple hover:underline"
            >
              {hasAddon ? (
                <>
                  <ToggleRight className="w-6 h-6 text-odoo-teal" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                  <span>Disabled</span>
                </>
              )}
            </button>
          </div>

          {/* Subscription Line Items Table (PDF Requirement) */}
          <div className="border border-odoo-border rounded-lg overflow-hidden">
            <div className="bg-gray-100/70 px-4 py-2 border-b border-odoo-border font-bold text-xs text-gray-700">
              Contract Lines & Product Variants
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-[10px] uppercase border-b border-odoo-border">
                <tr>
                  <th className="px-4 py-2">Product & Variant</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-right">Taxes</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                <tr className="hover:bg-odoo-canvas">
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900">Brightloop Core ERP License</div>
                    <div className="text-[11px] text-odoo-purple font-semibold">
                      Variant: Brand Edition = Odoo Enterprise Edition (+$560 Surcharge)
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">5</td>
                  <td className="px-4 py-3 text-right font-mono">$680.00</td>
                  <td className="px-4 py-3 text-right">10% ($340.00)</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">$3,740.00</td>
                </tr>

                {hasAddon && (
                  <tr className="hover:bg-odoo-canvas">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">Advanced Invoicing Engine (Add-on)</div>
                      <div className="text-[11px] text-gray-500">Self-service automated recurring invoices</div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">1</td>
                    <td className="px-4 py-3 text-right font-mono">$49.00</td>
                    <td className="px-4 py-3 text-right">10% ($4.90)</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">$53.90</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Calculated Taxes (10%):</span>
                <span className="font-mono font-medium">{formatMoney(taxTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-odoo-border pt-2">
                <span>Total Recurring Value:</span>
                <span className="text-odoo-purple font-mono">{formatMoney(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Odoo Chatter Component */}
        <Chatter
          entityType="subscription"
          entityId={sub.id}
          initialLogs={initialActivityLogs}
        />
      </main>

      <CommandPalette />
    </div>
  );
}

