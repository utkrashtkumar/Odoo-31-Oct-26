import { NextResponse } from "next/server";
import { initialSubscriptions, initialInvoices } from "@/lib/data-store";
import { Invoice } from "@/types";
import Decimal from "decimal.js";
import { addDays, addMonths, addYears, format } from "date-fns";

export async function POST() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const generatedInvoices: Invoice[] = [];
    let skippedCount = 0;

    // Iterate through active subscriptions
    for (const sub of initialSubscriptions) {
      if (sub.status !== "active") continue;

      const nextBilling = sub.next_billing_date ? new Date(sub.next_billing_date) : null;
      if (!nextBilling || nextBilling > today) {
        // Not due yet
        continue;
      }

      // Idempotency safeguard: check if an invoice already exists for this billing period
      const cycleStartStr = format(nextBilling, "yyyy-MM-dd");
      const alreadyBilled = initialInvoices.some(
        (inv) => inv.subscription_id === sub.id && inv.billing_cycle_start === cycleStartStr
      );

      if (alreadyBilled) {
        skippedCount++;
        continue;
      }

      // Calculate totals using Decimal.js arbitrary precision (Zero Rounding Errors)
      let subtotal = new Decimal(0);
      let taxTotal = new Decimal(0);

      const lines = sub.lines || [];
      for (const line of lines) {
        const lineSubtotal = new Decimal(line.unit_price).times(line.quantity);
        const lineTax = lineSubtotal.times(new Decimal(line.tax_rate).dividedBy(100));
        subtotal = subtotal.plus(lineSubtotal);
        taxTotal = taxTotal.plus(lineTax);
      }

      // Calculate next cycle dates based on plan interval
      const cycleStart = nextBilling;
      let cycleEnd = addMonths(cycleStart, 1);
      let nextNextBilling = cycleEnd;

      if (sub.plan_id === "plan-yearly-ent") {
        cycleEnd = addYears(cycleStart, 1);
        nextNextBilling = cycleEnd;
      } else if (sub.plan_id === "plan-weekly-flex") {
        cycleEnd = addDays(cycleStart, 7);
        nextNextBilling = cycleEnd;
      }

      const totalAmount = subtotal.plus(taxTotal);
      const invoiceNumber = `INV-2026-${String(initialInvoices.length + generatedInvoices.length + 1).padStart(4, "0")}`;

      const newInvoice: Invoice = {
        id: `inv-${Date.now()}-${generatedInvoices.length}`,
        invoice_number: invoiceNumber,
        subscription_id: sub.id,
        customer_id: sub.customer_id,
        issue_date: format(today, "yyyy-MM-dd"),
        due_date: format(addDays(today, 15), "yyyy-MM-dd"),
        status: "confirmed",
        subtotal_amount: subtotal.toNumber(),
        tax_amount: taxTotal.toNumber(),
        discount_amount: 0,
        total_amount: totalAmount.toNumber(),
        balance_due: totalAmount.toNumber(),
        billing_cycle_start: cycleStartStr,
        billing_cycle_end: format(cycleEnd, "yyyy-MM-dd"),
        payments: [],
      };

      generatedInvoices.push(newInvoice);

      // Advance subscription next_billing_date
      sub.next_billing_date = format(nextNextBilling, "yyyy-MM-dd");

      // Check auto_close rule if plan has autoClose: true and expiry reached
      if (sub.expiry_date && new Date(sub.expiry_date) <= nextNextBilling) {
        sub.status = "closed";
      }
    }

    // Append generated invoices to store
    initialInvoices.push(...generatedInvoices);

    return NextResponse.json({
      success: true,
      message: `Billing run complete: ${generatedInvoices.length} invoices generated, ${skippedCount} skipped (idempotent safeguard).`,
      generatedCount: generatedInvoices.length,
      skippedCount,
      invoices: generatedInvoices,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Billing automation error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
