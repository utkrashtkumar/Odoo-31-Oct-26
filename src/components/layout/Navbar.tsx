"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutGrid, Search, PlayCircle, 
  LogOut, LogIn, UserPlus 
} from "lucide-react";
import { AppSwitcherModal } from "./AppSwitcherModal";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  currentApp?: string;
}

export function Navbar({ currentApp = "Subscriptions" }: NavbarProps) {
  const { user, role, switchRole, signOut } = useAuth();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [billingRunning, setBillingRunning] = useState(false);
  const [billingMsg, setBillingMsg] = useState<string | null>(null);

  // One-click Billing Day automated runner
  const handleRunBillingDay = async () => {
    setBillingRunning(true);
    setBillingMsg(null);
    try {
      const res = await fetch("/api/billing/run", { method: "POST" });
      const data = await res.json();
      setBillingMsg(data.message || "Billing run completed successfully!");
      setTimeout(() => setBillingMsg(null), 4000);
    } catch {
      setBillingMsg("Billing run trigger encountered an error.");
      setTimeout(() => setBillingMsg(null), 4000);
    } finally {
      setBillingRunning(false);
    }
  };

  return (
    <>
      <header className="bg-odoo-purple text-white shadow-sm border-b border-black/10 select-none sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 h-12">
          {/* Left: App Launcher & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="p-1.5 rounded hover:bg-black/15 transition text-white/90 hover:text-white flex items-center justify-center focus:outline-none"
              title="Open App Launcher"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight hover:opacity-90">
                Odoo
              </span>
              <span className="text-white/40">/</span>
              <span className="font-semibold text-sm text-odoo-purple-subtle bg-black/15 px-2 py-0.5 rounded">
                {currentApp}
              </span>
            </Link>
          </div>

          {/* Center: Search & Billing Day Automation Action */}
          <div className="flex items-center space-x-3">
            {billingMsg && (
              <span className="text-xs bg-odoo-teal px-2.5 py-1 rounded-full font-medium text-white shadow animate-in fade-in duration-150">
                {billingMsg}
              </span>
            )}

            <button
              onClick={handleRunBillingDay}
              disabled={billingRunning}
              className="flex items-center space-x-1.5 bg-odoo-teal hover:bg-odoo-teal-dark active:scale-95 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-sm transition"
              title="Trigger automated billing day batch invoice generation"
            >
              <PlayCircle className={`w-3.5 h-3.5 ${billingRunning ? "animate-spin" : ""}`} />
              <span>{billingRunning ? "Running..." : "⚡ Run Billing Day"}</span>
            </button>

            <button 
              onClick={() => {
                const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
                window.dispatchEvent(event);
              }}
              className="hidden md:flex items-center space-x-2 bg-black/20 hover:bg-black/30 text-white/70 hover:text-white text-xs px-3 py-1.5 rounded transition border border-white/10"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search (⌘K)...</span>
            </button>
          </div>

          {/* Right: Auth Profile & Role Switcher */}
          <div className="flex items-center space-x-2.5 text-xs">
            {/* Quick Role Toggle */}
            <div className="hidden lg:flex items-center bg-black/25 rounded-md p-0.5 border border-white/10">
              <span className="text-[10px] text-white/60 px-1.5">Role:</span>
              <button
                onClick={() => switchRole("admin")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition ${
                  role === "admin" ? "bg-white text-odoo-purple" : "text-white/80 hover:text-white"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => switchRole("staff")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition ${
                  role === "staff" ? "bg-white text-odoo-purple" : "text-white/80 hover:text-white"
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => switchRole("customer")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition ${
                  role === "customer" ? "bg-white text-odoo-purple" : "text-white/80 hover:text-white"
                }`}
              >
                Customer
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <div className="font-semibold text-white text-[11px] leading-tight truncate max-w-28">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-odoo-teal capitalize">
                    {user.role}
                  </div>
                </div>

                <button
                  onClick={signOut}
                  className="p-1 text-white/70 hover:text-white hover:bg-black/20 rounded transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  href="/signin"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-2.5 py-1 rounded transition flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="bg-odoo-teal hover:bg-odoo-teal-dark text-white font-semibold px-2.5 py-1 rounded transition flex items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* App Switcher Modal */}
      <AppSwitcherModal 
        isOpen={isSwitcherOpen} 
        onClose={() => setIsSwitcherOpen(false)} 
      />
    </>
  );
}
