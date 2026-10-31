"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { 
  FileText, CreditCard, Package, Layers, 
  Search, Percent, BarChart3, Users
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-odoo-border overflow-hidden">
        <Command className="w-full">
          <div className="flex items-center px-3 border-b border-odoo-border bg-gray-50/50">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <Command.Input
              placeholder="Search subscriptions, invoices, products, or apps (Cmd+K)..."
              className="w-full py-3 text-xs bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
              autoFocus
            />
            <kbd className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500 font-mono">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 text-xs">
            <Command.Empty className="py-6 text-center text-gray-400 text-xs">
              No matching records found.
            </Command.Empty>

            <Command.Group heading="Apps & Modules" className="text-[11px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
              <Command.Item
                onSelect={() => navigate("/subscriptions")}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <FileText className="w-4 h-4 text-odoo-purple" />
                <span>Subscriptions Pipeline & Contracts</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/invoices")}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <CreditCard className="w-4 h-4 text-odoo-teal" />
                <span>Invoices, Payments & Overdue Aging</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/dashboard")}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <BarChart3 className="w-4 h-4 text-rose-500" />
                <span>Finance Lead Dashboard (MRR, Owed, Collections)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/products")}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <Package className="w-4 h-4 text-blue-500" />
                <span>Products & Brand Variants (+$560)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/plans")}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Pricing Plans & Auto-Close Rules</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/discounts")}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <Percent className="w-4 h-4 text-emerald-500" />
                <span>Discount Rules Engine</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Sample Subscriptions" className="text-[11px] font-semibold text-gray-400 px-2 py-1 mt-2 uppercase tracking-wider">
              <Command.Item
                onSelect={() => navigate("/subscriptions/sub-00101")}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium">SUB-00101 — Acme Enterprises Inc.</span>
                </div>
                <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded">Active</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/subscriptions/sub-00102")}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium">SUB-00102 — Corner Bakery & Cafe</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">Overdue</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Customer Portal" className="text-[11px] font-semibold text-gray-400 px-2 py-1 mt-2 uppercase tracking-wider">
              <Command.Item
                onSelect={() => navigate("/portal")}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-odoo-purple/10 hover:text-odoo-purple cursor-pointer transition text-gray-700"
              >
                <Users className="w-4 h-4 text-slate-600" />
                <span>Open Public Customer Web Portal</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

