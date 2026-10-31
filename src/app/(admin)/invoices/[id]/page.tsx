"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { StatusPipeline } from "@/components/common/StatusPipeline";
import { Chatter } from "@/components/common/Chatter";
import { CommandPalette } from "@/components/common/CommandPalette";
import { initialInvoices, initialActivityLogs } from "@/lib/data-store";
import { formatMoney, formatDate } from "@/lib/utils";
import { InvoiceStatus, PaymentMethod } from "@/types";
import { 
  Check, Printer, Send, 
  CreditCard, ShieldCheck, DollarSign, X
} from "lucide-react";
import Decimal from "decimal.js";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const inv = initialInvoices.find((i) => i.id === params.id) || initialInvoices[0];

  const [currentStatus, setCurrentStatus] = useState<InvoiceStatus>(inv.status);
  const [balanceDue, setBalanceDue] = useState(inv.balance_due);
  const [payments, setPayments] = useState(inv.payments || []);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(inv.balance_due.toString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentRef, setPaymentRef] = useState("");

  const stages: { id: InvoiceStatus; label: string }[] = [
    { id: "draft", label: "Draft" },
    { id: "confirmed", label: "Confirmed" },
    { id: "paid", label: "Paid" },
  ];

  const handleStageChange = (newStage: InvoiceStatus) => {
    setCurrentStatus(newStage);
    inv.status = newStage;
    setStatusMsg(`Invoice moved to ${newStage.toUpperCase()}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const payAmt = parseFloat(paymentAmount) || 0;
    if (payAmt <= 0) return;

    const newBal = new Decimal(balanceDue).minus(payAmt);
    const updatedBal = newBal.isNegative() ? 0 : newBal.toNumber();

    const newPayment = {
      id: `pay-${Date.now()}`,
      invoice_id: inv.id,
      payment_method: paymentMethod,
      amount: payAmt,
      payment_date: new Date().toISOString().split("T")[0],
      transaction_reference: paymentRef.trim() || undefined,
      notes: paymentNote.trim() || undefined,
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    setBalanceDue(updatedBal);
    inv.balance_due = updatedBal;
    inv.payments = updatedPayments;

    if (updatedBal === 0) {
      setCurrentStatus("paid");
      inv.status = "paid";
    }

    setIsPaymentModalOpen(false);
    setStatusMsg(`Payment of ${formatMoney(payAmt)} successfully recorded.`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-odoo-canvas pb-12">
      <Navbar currentApp="Invoicing" />

      <ControlPanel
        breadcrumbs={[
          { label: "Brightloop Invoicing", href: "/invoices" },
          { label: inv.invoice_number },
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
        {/* Top Action Bar & Pipeline */}
        <div className="bg-white p-3 rounded-t-lg border border-odoo-border border-b-0 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {currentStatus === "draft" && (
              <button
                onClick={() => handleStageChange("confirmed")}
                className="bg-odoo-purple hover:bg-odoo-purple-dark text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Invoice</span>
              </button>
            )}

            {currentStatus === "confirmed" && balanceDue > 0 && (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-odoo-teal hover:bg-odoo-teal-dark text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Register Payment</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="bg-white border border-odoo-border hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>Print / Download</span>
            </button>

            <button
              onClick={() => {
                alert(`Invoice ${inv.invoice_number} sent to registered customer email.`);
              }}
              className="bg-white border border-odoo-border hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5 text-gray-500" />
              <span>Send by Email</span>
            </button>

            {currentStatus !== "paid" && (
              <button
                onClick={() => handleStageChange("cancelled" as InvoiceStatus)}
                className="bg-white border border-odoo-border hover:bg-red-50 text-red-600 text-xs font-medium px-3 py-1.5 rounded shadow-xs transition"
              >
                Cancel Invoice
              </button>
            )}

            <Link
              href="/subscriptions/sub-00101"
              className="text-xs text-odoo-purple hover:underline font-semibold ml-2"
            >
              Linked Subscription: SUB-00101 ↗
            </Link>
          </div>

          {/* Chevron Status Pipeline (Top Right) */}
          <StatusPipeline
            stages={stages}
            currentStage={currentStatus}
            onStageClick={handleStageChange}
          />
        </div>

        {/* Form Sheet Container */}
        <div className="odoo-sheet rounded-b-lg p-6 sm:p-8 space-y-6">
          {/* Header Title with Number & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-odoo-border gap-2">
            <div>
              <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Customer Invoice
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center space-x-3">
                <span>{inv.invoice_number}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded border uppercase ${
                  currentStatus === "paid"
                    ? "bg-odoo-teal-subtle text-odoo-teal-dark border-odoo-teal/20"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }`}>
                  {currentStatus}
                </span>
              </h1>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Amount Due:</div>
              <div className={`text-xl font-bold font-mono ${balanceDue > 0 ? "text-odoo-coral" : "text-odoo-teal"}`}>
                {balanceDue > 0 ? formatMoney(balanceDue) : "PAID"}
              </div>
            </div>
          </div>

          {/* Customer & Billing Period Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Customer:</span>
                <span className="font-bold text-gray-900">
                  {inv.id === "inv-2026-0001" ? "Acme Enterprises Inc." : "Corner Bakery & Cafe"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Billing Address:</span>
                <span className="text-gray-800">100 Innovation Way, Suite 400, Austin, TX</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Contract Reference:</span>
                <span className="font-mono text-odoo-purple">SUB-00101</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Invoice Date:</span>
                <span className="text-gray-800">{formatDate(inv.issue_date)}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Due Date:</span>
                <span className="text-gray-800">{formatDate(inv.due_date)}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-600">Billing Cycle:</span>
                <span className="font-mono text-gray-700">
                  {formatDate(inv.billing_cycle_start)} – {formatDate(inv.billing_cycle_end)}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Line Items Table */}
          <div className="border border-odoo-border rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                <tr>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-center">Quantity</th>
                  <th className="px-4 py-2.5 text-right">Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Taxes</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                <tr>
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900">Brightloop Core ERP License</div>
                    <div className="text-[11px] text-odoo-purple font-semibold">
                      Variant: Brand Edition = Enterprise Edition (+$560 Surcharge)
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">5</td>
                  <td className="px-4 py-3 text-right font-mono">$680.00</td>
                  <td className="px-4 py-3 text-right">Standard Tax (10%)</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">$3,400.00</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900">Advanced Invoicing Engine (Add-on)</div>
                    <div className="text-[11px] text-gray-500">Self-service automated recurring invoices</div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">1</td>
                  <td className="px-4 py-3 text-right font-mono">$49.00</td>
                  <td className="px-4 py-3 text-right">Standard Tax (10%)</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">$49.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtotals & Taxes breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Untaxed:</span>
                <span className="font-mono font-medium">{formatMoney(inv.subtotal_amount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes (10% Automated):</span>
                <span className="font-mono font-medium">{formatMoney(inv.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-odoo-border pt-2">
                <span>Total Amount:</span>
                <span className="text-odoo-purple font-mono">{formatMoney(inv.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-odoo-border pt-2">
                <span className="text-gray-700">Balance Due:</span>
                <span className={`font-mono ${balanceDue > 0 ? "text-odoo-coral" : "text-odoo-teal"}`}>
                  {formatMoney(balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Recorded Payments Ledger */}
          <div className="border border-odoo-border rounded-lg overflow-hidden bg-gray-50/50">
            <div className="px-4 py-2 border-b border-odoo-border font-bold text-xs text-gray-700 flex items-center justify-between">
              <span>Reconciled Payments Ledger</span>
              <span className="text-[11px] text-gray-500">{payments.length} Payment(s) Recorded</span>
            </div>

            {payments.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                No payments recorded yet. Click &quot;Register Payment&quot; above to log a receipt.
              </div>
            ) : (
              <div className="divide-y divide-odoo-border text-xs">
                {payments.map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between bg-white">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 capitalize">
                          {p.payment_method.replace("_", " ")}
                        </span>
                        {p.transaction_reference && (
                          <span className="bg-gray-100 text-gray-700 font-mono text-[10px] px-1.5 py-0.5 rounded border border-gray-200">
                            Ref: {p.transaction_reference}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {p.notes || "Payment received and reconciled against invoice."}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-odoo-teal font-mono">
                        {formatMoney(p.amount)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {formatDate(p.payment_date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity & Chatter Component */}
        <Chatter
          entityType="invoice"
          entityId={inv.id}
          initialLogs={initialActivityLogs.filter((l) => l.entity_id === inv.id)}
        />
      </main>

      {/* Register Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-odoo-border overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-odoo-border">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-odoo-teal" />
                <span>Register Payment — {inv.invoice_number}</span>
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={balanceDue}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple text-sm font-mono font-bold"
                  required
                />
                <span className="text-[10px] text-gray-500">Max remaining due: {formatMoney(balanceDue)}</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple bg-white"
                >
                  <option value="bank_transfer">Bank Transfer / Wire</option>
                  <option value="credit_card">Credit Card (Stripe)</option>
                  <option value="cash">Cash / Check</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. WIRE-ACH-99023 or Check #1042"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Payment Note
                </label>
                <textarea
                  placeholder="e.g. Paid in full via direct bank transfer confirmed by finance."
                  rows={2}
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-odoo-border">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 py-1.5 border border-odoo-border rounded hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-odoo-teal hover:bg-odoo-teal-dark text-white rounded font-bold transition shadow-xs flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confirm Payment</span>
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

