"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { CommandPalette } from "@/components/common/CommandPalette";
import { initialDiscounts } from "@/lib/data-store";
import { formatMoney, formatDate } from "@/lib/utils";
import { Percent, Plus, ShieldCheck, X } from "lucide-react";
import { Discount } from "@/types";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("10.00");
  const [minPurchase, setMinPurchase] = useState("0");
  const [minQty, setMinQty] = useState("1");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [maxUses, setMaxUses] = useState("100");
  const [scope, setScope] = useState<"subscription" | "product">("subscription");

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const newDisc: Discount = {
      id: `disc-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discount_type: type,
      value: parseFloat(value) || 0,
      min_purchase_amount: parseFloat(minPurchase) || 0,
      min_quantity: parseInt(minQty, 10) || 0,
      start_date: startDate,
      end_date: endDate,
      max_uses: parseInt(maxUses, 10) || null,
      used_count: 0,
      scope,
      product_id: null,
      is_active: true,
    };

    setDiscounts([newDisc, ...discounts]);
    setIsModalOpen(false);
    setCode("");
  };

  const filteredDiscounts = discounts.filter((d) => {
    if (!search) return true;
    return d.code.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-odoo-canvas">
      <Navbar currentApp="Discounts" />

      <ControlPanel
        breadcrumbs={[{ label: "Brightloop Settings", href: "/discounts" }, { label: "Discount Rules Engine" }]}
        newButtonLabel="New Discount Rule"
        onNewClick={() => setIsModalOpen(true)}
        searchPlaceholder="Search discount code..."
        searchTerm={search}
        onSearchChange={setSearch}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-odoo-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-odoo-border bg-gray-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Percent className="w-4 h-4 text-emerald-600" />
                <span>Admin Discount Rules & Automated Deductions</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Admin-governed discount rules. Auto-applies to eligible invoices; auto-stops when expired or usage limit is reached.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">Admin Access Verified</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                <tr>
                  <th className="px-4 py-2.5">Promo Code</th>
                  <th className="px-4 py-2.5">Discount Value</th>
                  <th className="px-4 py-2.5">Scope</th>
                  <th className="px-4 py-2.5 text-right">Min Purchase</th>
                  <th className="px-4 py-2.5 text-center">Min Quantity</th>
                  <th className="px-4 py-2.5">Valid Window</th>
                  <th className="px-4 py-2.5 text-center">Usage Tracking</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                {filteredDiscounts.map((disc) => {
                  const isMaxedOut = disc.max_uses !== null && disc.used_count >= disc.max_uses;
                  return (
                    <tr key={disc.id} className="hover:bg-odoo-canvas transition">
                      <td className="px-4 py-3 font-bold font-mono text-odoo-purple">
                        {disc.code}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-700 font-mono">
                        {disc.discount_type === "percentage" ? `${disc.value}% OFF` : `-${formatMoney(disc.value)}`}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-700">
                        {disc.scope}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-mono">
                        {disc.min_purchase_amount > 0 ? formatMoney(disc.min_purchase_amount) : "None"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 font-bold">
                        {disc.min_quantity > 0 ? `${disc.min_quantity} seats` : "Any"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-[11px]">
                        {formatDate(disc.start_date)} – {formatDate(disc.end_date)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono text-xs">
                          <strong className="text-gray-900">{disc.used_count}</strong>
                          <span className="text-gray-400">/{disc.max_uses || "∞"}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isMaxedOut ? (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Limit Reached
                          </span>
                        ) : disc.is_active ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                            Disabled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Discount Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-odoo-border overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-odoo-border">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Create Discount Rule (Admin Only)</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscount} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEATS20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Value ({type === "percentage" ? "%" : "$"})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min Purchase ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min Quantity (Seats)</label>
                  <input
                    type="number"
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as "subscription" | "product")}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple bg-white"
                  >
                    <option value="subscription">Whole Subscription</option>
                    <option value="product">Specific Product</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-odoo-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-odoo-border rounded hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition shadow-xs"
                >
                  Save Discount Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CommandPalette />
    </div>
  );
}

