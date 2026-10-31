import Decimal from "decimal.js";
import { differenceInDays, parseISO } from "date-fns";

export interface ProrationCalculation {
  totalDaysInCycle: number;
  daysRemaining: number;
  daysUsed: number;
  dailyRate: number;
  proratedAmount: number;
  action: "charge" | "credit";
  explanation: string;
}

/**
 * Calculates arbitrary-precision prorated billing amounts for mid-cycle additions or cancellations.
 */
export function calculateProration(
  cycleStart: string | Date,
  cycleEnd: string | Date,
  changeDate: string | Date = new Date(),
  itemMonthlyPrice: number,
  isAddition: boolean = true
): ProrationCalculation {
  const start = typeof cycleStart === "string" ? parseISO(cycleStart) : cycleStart;
  const end = typeof cycleEnd === "string" ? parseISO(cycleEnd) : cycleEnd;
  const change = typeof changeDate === "string" ? parseISO(changeDate) : changeDate;

  // Total cycle span (minimum 1 day)
  const totalDays = Math.max(1, differenceInDays(end, start));
  
  // Days remaining from change date to cycle end
  const rawRemaining = differenceInDays(end, change);
  const daysRemaining = Math.max(0, Math.min(totalDays, rawRemaining));
  const daysUsed = totalDays - daysRemaining;

  // High precision calculation with decimal.js
  const priceDec = new Decimal(itemMonthlyPrice);
  const totalDaysDec = new Decimal(totalDays);
  const daysRemainingDec = new Decimal(daysRemaining);

  const dailyRateDec = priceDec.dividedBy(totalDaysDec);
  const proratedAmountDec = dailyRateDec.times(daysRemainingDec);

  const proratedAmount = Number(proratedAmountDec.toFixed(2));
  const dailyRate = Number(dailyRateDec.toFixed(4));

  const action = isAddition ? "charge" : "credit";
  const explanation = isAddition
    ? `Added mid-cycle with ${daysRemaining} of ${totalDays} days remaining ($${dailyRate.toFixed(2)}/day). Immediate prorated charge: $${proratedAmount.toFixed(2)}.`
    : `Removed mid-cycle with ${daysRemaining} of ${totalDays} days remaining. Prorated credit applied to next invoice: $${proratedAmount.toFixed(2)}.`;

  return {
    totalDaysInCycle: totalDays,
    daysRemaining,
    daysUsed,
    dailyRate,
    proratedAmount,
    action,
    explanation,
  };
}

