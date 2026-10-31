"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { CommandPalette } from "@/components/common/CommandPalette";
import { initialTaxRules } from "@/lib/data-store";
import { ShieldCheck, Plus } from "lucide-react";
import { TaxRule } from "@/types";

export default function TaxesPage() {
  const [taxes] = useState<TaxRule[]>(initialTaxRules);

  return (
    <div className="min-h-screen bg-odoo-canvas">
      <Navbar currentApp="Tax Rules" />

      <ControlPanel
        breadcrumbs={[{ label: "Brightloop Settings", href: "/taxes" }, { label: "Tax Calculation Rules" }]}
        newButtonLabel="New Tax Rule"
        onNewClick={() => alert("New tax rule creator opens. Taxes apply automatically on invoice lines.")}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-odoo-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-odoo-border bg-gray-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Automated Tax Rules & Rate Engine</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                PDF Spec: Taxes are calculated automatically on billing day from rules configured by admin.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              Admin Governance Only
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                <tr>
                  <th className="px-4 py-2.5">Tax Name</th>
                  <th className="px-4 py-2.5 text-right">Tax Rate Percentage</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                {taxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-odoo-canvas transition">
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {tax.name}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">
                      {tax.rate_percentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Active in Engine
                      </span>
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

