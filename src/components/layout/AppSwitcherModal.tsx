"use client";

import Link from "next/link";
import { 
  FileText, CreditCard, Package, Layers, 
  Percent, ShieldCheck, BarChart3, Users, X
} from "lucide-react";

interface AppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSwitcherModal({ isOpen, onClose }: AppSwitcherModalProps) {
  if (!isOpen) return null;

  const apps = [
    { name: "Subscriptions", href: "/subscriptions", icon: FileText, color: "bg-purple-600", desc: "Contracts & renewals" },
    { name: "Invoicing", href: "/invoices", icon: CreditCard, color: "bg-teal-600", desc: "Customer bills & payments" },
    { name: "Products & Variants", href: "/products", icon: Package, color: "bg-blue-600", desc: "Catalog & brand variants" },
    { name: "Price Plans", href: "/plans", icon: Layers, color: "bg-indigo-600", desc: "Intervals & lifecycle rules" },
    { name: "Discounts", href: "/discounts", icon: Percent, color: "bg-emerald-600", desc: "Admin discount rules" },
    { name: "Tax Rules", href: "/taxes", icon: ShieldCheck, color: "bg-amber-600", desc: "Automated tax engines" },
    { name: "Finance Reporting", href: "/dashboard", icon: BarChart3, color: "bg-rose-600", desc: "MRR, revenue & overdue" },
    { name: "Customer Portal", href: "/portal", icon: Users, color: "bg-slate-700", desc: "Self-service client portal" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#2A2B2D] text-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-white/10 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-8 h-8 rounded bg-odoo-purple flex items-center justify-center font-bold text-white text-lg">
            B
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Brightloop Enterprise Apps</h2>
            <p className="text-xs text-white/50">Unified Subscription & Billing System</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.name}
                href={app.href}
                onClick={onClose}
                className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/10 transition group border border-transparent hover:border-white/10"
              >
                <div className={`w-14 h-14 rounded-2xl ${app.color} text-white flex items-center justify-center shadow-lg mb-3 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="font-semibold text-sm text-white group-hover:text-odoo-teal transition">
                  {app.name}
                </span>
                <span className="text-[11px] text-white/50 mt-1 line-clamp-1">
                  {app.desc}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span>Brightloop Software Platform</span>
          <span>Version 1.0</span>
        </div>
      </div>
    </div>
  );
}
