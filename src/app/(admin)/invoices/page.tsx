"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { CommandPalette } from "@/components/common/CommandPalette";
import { initialInvoices } from "@/lib/data-store";
import { formatMoney, formatDate, getAgingBucket } from "@/lib/utils";
import { CreditCard, ExternalLink, AlertTriangle } from "lucide-react";

export default function InvoicesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredInvoices = initialInvoices.filter((inv) => {
    const isOverdue = inv.status === "confirmed" && new Date(inv.due_date) < new Date();

    if (filter === "paid" && inv.status !== "paid") return false;
    if (filter === "confirmed" && inv.status !== "confirmed") return false;
    if (filter === "draft" && inv.status !== "draft") return false;
    if (filter === "overdue" && !isOverdue) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchNum = inv.invoice_number.toLowerCase().includes(q);
      return matchNum;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-odoo-canvas">
      <Navbar currentApp="Invoicing" />

      <ControlPanel
        breadcrumbs={[{ label: "Brightloop Invoicing", href: "/invoices" }, { label: "Customer Invoices" }]}
        newButtonLabel="New Invoice"
        onNewClick={() => {
          window.location.href = "/invoices/inv-2026-0001";
        }}
        searchPlaceholder="Search invoice # (e.g. INV-2026)..."
        searchTerm={search}
        onSearchChange={setSearch}
        filters={[
          { id: "all", label: "All" },
          { id: "draft", label: "Draft" },
          { id: "confirmed", label: "Confirmed" },
          { id: "overdue", label: "Overdue" },
          { id: "paid", label: "Paid" },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-odoo-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                <tr>
                  <th className="px-4 py-2.5">Invoice #</th>
                  <th className="px-4 py-2.5">Customer Account</th>
                  <th className="px-4 py-2.5">Issue Date</th>
                  <th className="px-4 py-2.5">Due Date</th>
                  <th className="px-4 py-2.5">Aging Classification</th>
                  <th className="px-4 py-2.5">Status Pipeline</th>
                  <th className="px-4 py-2.5 text-right">Total Amount</th>
                  <th className="px-4 py-2.5 text-right">Balance Due</th>
                  <th className="px-4 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                {filteredInvoices.map((inv) => {
                  const isPaid = inv.status === "paid";
                  const aging = getAgingBucket(inv.due_date, isPaid);

                  return (
                    <tr key={inv.id} className="hover:bg-odoo-canvas transition">
                      <td className="px-4 py-3 font-bold text-odoo-purple">
                        <Link href={`/invoices/${inv.id}`} className="hover:underline flex items-center space-x-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          <span>{inv.invoice_number}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">
                          {inv.id === "inv-2026-0001" ? "Acme Enterprises Inc." : "Corner Bakery & Cafe"}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">SUB-00101</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono">
                        {formatDate(inv.issue_date)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono">
                        {formatDate(inv.due_date)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${aging.badgeClass}`}>
                          {aging.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                          inv.status === "paid"
                            ? "bg-odoo-teal-subtle text-odoo-teal-dark border border-odoo-teal/20"
                            : inv.status === "confirmed"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {formatMoney(inv.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {inv.balance_due > 0 ? (
                          <span className="text-odoo-coral flex items-center justify-end space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{formatMoney(inv.balance_due)}</span>
                          </span>
                        ) : (
                          <span className="text-odoo-teal">Paid In Full</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="inline-flex items-center space-x-1 text-xs text-odoo-purple hover:underline font-semibold"
                        >
                          <span>Review</span>
                          <ExternalLink className="w-3 h-3" />
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

      <CommandPalette />
    </div>
  );
}

