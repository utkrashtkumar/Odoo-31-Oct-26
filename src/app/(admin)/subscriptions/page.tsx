"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { CommandPalette } from "@/components/common/CommandPalette";
import { HealthScoreBadge } from "@/components/common/HealthScoreBadge";
import { initialSubscriptions } from "@/lib/data-store";
import { formatMoney, formatDate } from "@/lib/utils";
import { FileText, ArrowRight, Plus } from "lucide-react";

export default function SubscriptionsPage() {
  const [view, setView] = useState<"list" | "kanban" | "graph">("list");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredSubs = initialSubscriptions.filter((sub) => {
    if (filter === "active" && sub.status !== "active") return false;
    if (filter === "quotation" && sub.status !== "quotation") return false;
    if (filter === "closed" && sub.status !== "closed") return false;

    if (search) {
      const q = search.toLowerCase();
      const matchNum = sub.subscription_number.toLowerCase().includes(q);
      const matchNotes = sub.notes?.toLowerCase().includes(q) || false;
      return matchNum || matchNotes;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-odoo-canvas">
      <Navbar currentApp="Subscriptions" />

      <ControlPanel
        breadcrumbs={[{ label: "Brightloop Subscriptions" }]}
        newButtonLabel="New Subscription"
        onNewClick={() => {
          window.location.href = "/subscriptions/sub-00101";
        }}
        searchPlaceholder="Search subscription # or customer..."
        searchTerm={search}
        onSearchChange={setSearch}
        filters={[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "quotation", label: "Quotations" },
          { id: "closed", label: "Closed" },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        activeView={view}
        onViewChange={setView}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === "list" ? (
          /* Table / Tree View */
          <div className="bg-white rounded-lg border border-odoo-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                  <tr>
                    <th className="px-4 py-2.5">Subscription #</th>
                    <th className="px-4 py-2.5">Customer</th>
                    <th className="px-4 py-2.5">Plan Frequency</th>
                    <th className="px-4 py-2.5">Next Billing Date</th>
                    <th className="px-4 py-2.5">Status Pipeline</th>
                    <th className="px-4 py-2.5">Health Score</th>
                    <th className="px-4 py-2.5 text-right">Recurring Value</th>
                    <th className="px-4 py-2.5 text-center">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-odoo-border">
                  {filteredSubs.map((sub) => {
                    const totalVal = sub.lines?.reduce((sum, l) => sum + l.total, 0) || 0;
                    return (
                      <tr key={sub.id} className="hover:bg-odoo-canvas transition group">
                        <td className="px-4 py-3 font-bold text-odoo-purple">
                          <Link href={`/subscriptions/${sub.id}`} className="hover:underline flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-odoo-purple transition" />
                            <span>{sub.subscription_number}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {sub.id === "sub-00101" ? "Acme Enterprises Inc." : sub.id === "sub-00102" ? "Corner Bakery & Cafe" : "Acme Corp (QA Pass)"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {sub.plan_id === "plan-yearly-ent" ? "Enterprise (Yearly)" : sub.plan_id === "plan-weekly-flex" ? "Weekly Pass" : "Business Starter (Monthly)"}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-700">
                          {formatDate(sub.next_billing_date)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            sub.status === "active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : sub.status === "quotation"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <HealthScoreBadge score={sub.health_score} label={sub.health_label} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {formatMoney(totalVal)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/subscriptions/${sub.id}`}
                            className="inline-flex items-center text-odoo-purple hover:text-odoo-purple-dark font-semibold p-1 hover:bg-gray-100 rounded"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Kanban View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["quotation", "confirmed", "active"] as const).map((colStatus) => {
              const colSubs = filteredSubs.filter((s) => s.status === colStatus);
              return (
                <div key={colStatus} className="bg-gray-100/70 p-3 rounded-lg border border-odoo-border">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
                      {colStatus}
                    </span>
                    <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold border border-odoo-border">
                      {colSubs.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colSubs.map((sub) => {
                      const totalVal = sub.lines?.reduce((sum, l) => sum + l.total, 0) || 0;
                      return (
                        <Link
                          key={sub.id}
                          href={`/subscriptions/${sub.id}`}
                          className="block bg-white p-4 rounded-lg border border-odoo-border shadow-xs hover:border-odoo-purple/50 transition group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-odoo-purple group-hover:underline text-xs">
                              {sub.subscription_number}
                            </span>
                            <HealthScoreBadge score={sub.health_score} label={sub.health_label} size="sm" />
                          </div>
                          <div className="font-semibold text-gray-900 text-xs mt-1">
                            {sub.id === "sub-00101" ? "Acme Enterprises Inc." : sub.id === "sub-00102" ? "Corner Bakery & Cafe" : "Acme Corp (QA Pass)"}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                            <span>Next: {formatDate(sub.next_billing_date)}</span>
                            <span className="font-bold text-gray-900">{formatMoney(totalVal)}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <CommandPalette />
    </div>
  );
}

