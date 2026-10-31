import { NextResponse } from "next/server";
import { initialSubscriptions, initialInvoices, initialActivityLogs } from "@/lib/data-store";
import { differenceInDays, parseISO } from "date-fns";

export async function POST() {
  try {
    const today = new Date();
    let remindersSent = 0;
    let accountsSuspended = 0;
    const actionsTaken: string[] = [];

    // Find all overdue invoices
    const overdueInvoices = initialInvoices.filter((inv) => {
      if (inv.status === "paid" || inv.balance_due <= 0) return false;
      const due = parseISO(inv.due_date);
      return differenceInDays(today, due) > 0;
    });

    for (const inv of overdueInvoices) {
      const daysPastDue = differenceInDays(today, parseISO(inv.due_date));
      const sub = initialSubscriptions.find((s) => s.id === inv.subscription_id);

      if (daysPastDue <= 14) {
        // Tier 1: Gentle Reminder
        remindersSent++;
        actionsTaken.push(`[Tier 1] Dispatched gentle reminder for ${inv.invoice_number} (${daysPastDue}d overdue) to customer.`);
      } else if (daysPastDue <= 30) {
        // Tier 2: Urgent Notice
        remindersSent++;
        actionsTaken.push(`[Tier 2] Dispatched urgent payment demand for ${inv.invoice_number} (${daysPastDue}d overdue).`);
      } else {
        // Tier 3: Auto-Suspension of Subscription Contract
        if (sub && sub.status === "active") {
          sub.status = "closed";
          accountsSuspended++;
          actionsTaken.push(`[Tier 3 Auto-Suspend] Contract ${sub.subscription_number} suspended: invoice ${inv.invoice_number} is ${daysPastDue} days overdue (exceeding plan grace period).`);

          // Append audit trail to Chatter
          initialActivityLogs.unshift({
            id: `act-dunning-${Date.now()}-${sub.id}`,
            entity_type: "subscription",
            entity_id: sub.id,
            action: "status_change",
            message: `Automated Dunning Sweep: Contract auto-suspended due to unpaid invoice ${inv.invoice_number} ($${inv.balance_due.toFixed(2)}) exceeding 30-day grace period.`,
            created_at: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Dunning sweep completed: ${remindersSent} reminders dispatched, ${accountsSuspended} contract(s) auto-suspended.`,
      stats: {
        totalEvaluated: overdueInvoices.length,
        remindersSent,
        accountsSuspended,
      },
      log: actionsTaken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Dunning sweep error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

