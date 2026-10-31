import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Decimal from "decimal.js";
import { format, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Arbitrary-precision money formatting (zero floating-point drift)
export function formatMoney(amount: number | string | Decimal, currencySymbol = "$"): string {
  try {
    const d = new Decimal(amount || 0);
    return `${currencySymbol}${d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  } catch {
    return `${currencySymbol}0.00`;
  }
}

export function formatDate(date: string | Date | null | undefined, formatString = "MMM dd, yyyy"): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, formatString);
  } catch {
    return "—";
  }
}

// PDF Mandated Overdue Aging Categorization
export function getAgingBucket(dueDate: string | Date, isPaid = false): {
  bucket: "current" | "1-15" | "16-30" | "30+";
  daysPastDue: number;
  label: string;
  badgeClass: string;
} {
  if (isPaid) {
    return {
      bucket: "current",
      daysPastDue: 0,
      label: "Paid",
      badgeClass: "bg-odoo-teal-subtle text-odoo-teal-dark border-odoo-teal/20",
    };
  }

  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = differenceInDays(today, due);

  if (diff <= 0) {
    return {
      bucket: "current",
      daysPastDue: 0,
      label: "Current",
      badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
    };
  } else if (diff <= 15) {
    return {
      bucket: "1-15",
      daysPastDue: diff,
      label: `${diff}d Overdue`,
      badgeClass: "bg-odoo-amber-subtle text-odoo-amber border-odoo-amber/30",
    };
  } else if (diff <= 30) {
    return {
      bucket: "16-30",
      daysPastDue: diff,
      label: `${diff}d Overdue`,
      badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    };
  } else {
    return {
      bucket: "30+",
      daysPastDue: diff,
      label: `${diff}d Overdue`,
      badgeClass: "bg-odoo-coral-subtle text-odoo-coral border-odoo-coral/30",
    };
  }
}

// PDF Mandated Password Complexity Validator:
// "> 8 characters, with an uppercase letter, a lowercase letter and a special character"
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length <= 8) {
    return { isValid: false, message: "Password must be more than 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must include at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must include at least one lowercase letter." };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { isValid: false, message: "Password must include at least one special character." };
  }
  return { isValid: true };
}

