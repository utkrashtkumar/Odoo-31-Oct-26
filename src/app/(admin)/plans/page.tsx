"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { CommandPalette } from "@/components/common/CommandPalette";
import { initialPlans } from "@/lib/data-store";
import { formatMoney, formatDate } from "@/lib/utils";
import { Layers, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Plan } from "@/types";

export default function PlansPage() {
  const [plans] = useState<Plan[]>(initialPlans);
  const [search, setSearch] = useState("");

  const filteredPlans = plans.filter((p) => {
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-odoo-canvas">
      <Navbar currentApp="Price Plans" />

      <ControlPanel
        breadcrumbs={[{ label: "Odoo Catalog", href: "/products" }, { label: "Subscription Pricing Plans" }]}
        newButtonLabel="Create Plan"
        onNewClick={() => alert("New plan builder opens with lifecycle toggles: intervals, min quantity, auto-close, pause, renew.")}
        searchPlaceholder="Search plans..."
        searchTerm={search}
        onSearchChange={setSearch}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-odoo-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-odoo-border bg-gray-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Subscription Plans & Lifecycle Governance</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Daily, weekly, monthly, and yearly frequency with plan-by-plan closure rules.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
              {plans.length} Active Plans
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                <tr>
                  <th className="px-4 py-2.5">Plan Name</th>
                  <th className="px-4 py-2.5">Billing Interval</th>
                  <th className="px-4 py-2.5 text-right">Recurring Price</th>
                  <th className="px-4 py-2.5 text-center">Min Quantity</th>
                  <th className="px-4 py-2.5">Availability Window</th>
                  <th className="px-4 py-2.5 text-center">Auto-Close on Expiry</th>
                  <th className="px-4 py-2.5 text-center">Allow Pause</th>
                  <th className="px-4 py-2.5 text-center">Allow Early Close</th>
                  <th className="px-4 py-2.5 text-center">Allow Renew</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-odoo-canvas transition">
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {plan.name}
                    </td>
                    <td className="px-4 py-3 font-semibold uppercase text-indigo-700">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                        {plan.billing_interval}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 font-mono">
                      {formatMoney(plan.price)}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-700">
                      {plan.min_quantity}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono">
                      {formatDate(plan.valid_from)} – {formatDate(plan.valid_until)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {plan.auto_close ? (
                        <span className="inline-flex items-center text-emerald-700 font-bold space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-gray-400 space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>No</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {plan.allow_pause ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {plan.allow_early_close ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {plan.allow_renew ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CommandPalette />
    </div>
  );
}

