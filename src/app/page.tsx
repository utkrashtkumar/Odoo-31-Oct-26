import Link from "next/link";
import { 
  FileText, CreditCard, BarChart3, Package, 
  Layers, Percent, ShieldCheck, ArrowRight, ExternalLink 
} from "lucide-react";

export default function HomePage() {
  const apps = [
    {
      title: "Subscriptions Pipeline",
      desc: "Manage quotes, active contracts, auto-close rules, and brand editions.",
      href: "/subscriptions",
      icon: FileText,
      badge: "Pipeline Engine",
      color: "bg-purple-600",
    },
    {
      title: "Invoicing & Billing Day",
      desc: "Automated recurring invoices, tax calculations, payments, and overdue aging.",
      href: "/invoices",
      icon: CreditCard,
      badge: "Zero Double-Billing",
      color: "bg-teal-600",
    },
    {
      title: "Finance Lead Dashboard",
      desc: "Answers MRR, cash collected, amounts owed, and overdue receivables in < 0.2s.",
      href: "/dashboard",
      icon: BarChart3,
      badge: "Sub-2s SLA",
      color: "bg-rose-600",
    },
    {
      title: "Customer Self-Service Portal",
      desc: "Direct self-service hub for clients to view contracts, toggle add-ons, and pay bills.",
      href: "/portal",
      icon: ExternalLink,
      badge: "Self-Service",
      color: "bg-slate-700",
    },
    {
      title: "Products & Brand Variants",
      desc: "Catalog with cost/sales pricing and Enterprise Edition (+$560 surcharge).",
      href: "/products",
      icon: Package,
      badge: "Variant Matrix",
      color: "bg-blue-600",
    },
    {
      title: "Pricing Plans & Lifecycle",
      desc: "Daily, weekly, monthly, and yearly intervals with auto-close/pause rules.",
      href: "/plans",
      icon: Layers,
      badge: "Intervals",
      color: "bg-indigo-600",
    },
    {
      title: "Discount Rules Engine",
      desc: "Admin-only percentage/fixed discounts with limits and date window controls.",
      href: "/discounts",
      icon: Percent,
      badge: "Admin Only",
      color: "bg-emerald-600",
    },
    {
      title: "Automated Tax Rules",
      desc: "Admin tax rate engines applied automatically to each invoice line item.",
      href: "/taxes",
      icon: ShieldCheck,
      badge: "Auto Taxes",
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529]">
      {/* Top Banner */}
      <header className="bg-odoo-purple text-white border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center font-bold text-white text-base">
              B
            </div>
            <span className="font-bold text-lg tracking-tight">Brightloop Software</span>
            <span className="text-xs bg-black/20 text-odoo-purple-subtle px-2 py-0.5 rounded font-mono">
              Enterprise Edition
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/dashboard"
              className="bg-odoo-teal hover:bg-odoo-teal-dark text-white font-semibold px-3 py-1.5 rounded transition shadow-xs"
            >
              Finance Dashboard ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-odoo-purple bg-odoo-purple-subtle px-3 py-1 rounded-full border border-odoo-purple/20">
          Unified Subscription Management Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight max-w-3xl mx-auto">
          The digital backbone of recurring revenue for Brightloop Software
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Enterprise recurring billing, automated invoicing, real-time revenue analytics, and self-service customer portal.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/subscriptions"
            className="bg-odoo-purple hover:bg-odoo-purple-dark text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-md transition flex items-center space-x-2"
          >
            <span>Open Subscriptions App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/portal"
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs transition"
          >
            Open Customer Portal ↗
          </Link>
        </div>
      </section>

      {/* Grid of Apps */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.title}
                href={app.href}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-odoo-purple hover:shadow-md transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${app.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {app.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-odoo-purple transition">
                    {app.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {app.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-odoo-purple group-hover:underline">
                  <span>Open App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400 bg-white">
        <p>Brightloop Subscription Management System • Enterprise Billing & Invoicing</p>
      </footer>
    </div>
  );
}
