import { 
  Profile, Product, Plan, QuotationTemplate, 
  Subscription, Invoice, Payment, Discount, TaxRule, ActivityLog 
} from "@/types";
import { supabaseAdmin } from "./supabase/admin";

// Demo Initial Data for Odoo Subscription Platform:
// Core software licenses, configurable add-ons, and product variants with surcharges.

export const initialProfiles: Profile[] = [
  {
    id: "u-admin-01",
    email: "admin@odoo.com",
    name: "Alex Vance (Admin)",
    role: "admin",
    company_name: "Odoo S.A.",
    created_at: new Date().toISOString(),
  },
  {
    id: "u-staff-01",
    email: "sarah.rep@odoo.com",
    name: "Sarah Jenkins (Sales Rep)",
    role: "staff",
    company_name: "Odoo S.A.",
    created_at: new Date().toISOString(),
  },
  {
    id: "u-cust-01",
    email: "billing@acmecorp.com",
    name: "Marcus Sterling (Acme Enterprises)",
    role: "customer",
    company_name: "Acme Enterprises Inc.",
    address: "100 Innovation Way, Suite 400, Austin, TX",
    created_at: new Date().toISOString(),
  },
  {
    id: "u-cust-02",
    email: "owner@bakerycafe.com",
    name: "Elena Rostova (Corner Cafe)",
    role: "customer",
    company_name: "Corner Bakery & Cafe",
    address: "42 Market St, Portland, OR",
    created_at: new Date().toISOString(),
  },
];

export const initialProducts: Product[] = [
  {
    id: "prod-01",
    name: "Odoo Core ERP License",
    type: "software_license",
    sales_price: 120.00,
    cost_price: 35.00,
    notes: "Core business management seat billed on subscription.",
    is_active: true,
    variants: [
      { id: "var-01", product_id: "prod-01", attribute_name: "Brand Edition", attribute_value: "Standard Edition", price_surcharge: 0 },
      { id: "var-02", product_id: "prod-01", attribute_name: "Brand Edition", attribute_value: "Enterprise Edition", price_surcharge: 560.00 },
    ],
  },
  {
    id: "prod-02",
    name: "Advanced Invoicing & Recurring Billing Engine",
    type: "add_on",
    sales_price: 49.00,
    cost_price: 10.00,
    notes: "Automated recurring invoice generation, digital downloads, and payments.",
    is_active: true,
  },
  {
    id: "prod-03",
    name: "Priority 24/7 SLA Support",
    type: "service",
    sales_price: 199.00,
    cost_price: 60.00,
    notes: "Dedicated account manager and 1-hour response SLA.",
    is_active: true,
  },
];

export const initialPlans: Plan[] = [
  {
    id: "plan-monthly-std",
    name: "Business Starter (Monthly)",
    price: 120.00,
    billing_interval: "monthly",
    min_quantity: 1,
    valid_from: "2026-01-01",
    valid_until: "2028-12-31",
    auto_close: false,
    allow_pause: true,
    allow_early_close: true,
    allow_renew: true,
    grace_period_days: 7,
    is_active: true,
  },
  {
    id: "plan-yearly-ent",
    name: "Enterprise Annual Contract (Yearly)",
    price: 1200.00,
    billing_interval: "yearly",
    min_quantity: 5,
    valid_from: "2026-01-01",
    valid_until: "2029-12-31",
    auto_close: true, // Closes automatically when end date is reached
    allow_pause: false,
    allow_early_close: false,
    allow_renew: true,
    grace_period_days: 14,
    is_active: true,
  },
  {
    id: "plan-weekly-flex",
    name: "Weekly Project Pass",
    price: 35.00,
    billing_interval: "weekly",
    min_quantity: 1,
    valid_from: "2026-01-01",
    valid_until: "2027-12-31",
    auto_close: true,
    allow_pause: true,
    allow_early_close: true,
    allow_renew: true,
    grace_period_days: 2,
    is_active: true,
  },
];

export const initialQuotationTemplates: QuotationTemplate[] = [
  {
    id: "tpl-01",
    name: "Standard Enterprise Software Package (30 Days Validity)",
    plan_id: "plan-yearly-ent",
    validity_days: 30, // Stays valid for set number of days
    notes: "Pre-configured offer for large enterprise clients.",
    items: [
      {
        id: "tpl-line-1",
        template_id: "tpl-01",
        product_id: "prod-01",
        variant_id: "var-02", // Enterprise Edition (adds +560)
        quantity: 10,
        discount_rate: 0,
      },
      {
        id: "tpl-line-2",
        template_id: "tpl-01",
        product_id: "prod-02",
        quantity: 1,
        discount_rate: 0,
      },
    ],
  },
];

export const initialTaxRules: TaxRule[] = [
  { id: "tax-01", name: "Standard State Tax (10%)", rate_percentage: 10.00, is_active: true },
  { id: "tax-02", name: "Reduced Software Tax (5%)", rate_percentage: 5.00, is_active: true },
];

export const initialDiscounts: Discount[] = [
  {
    id: "disc-01",
    code: "SEATSOFFER15",
    discount_type: "percentage",
    value: 15.00,
    min_purchase_amount: 500.00,
    min_quantity: 5,
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    max_uses: 50,
    used_count: 3,
    scope: "subscription",
    product_id: null,
    is_active: true,
  },
  {
    id: "disc-02",
    code: "WELCOME50",
    discount_type: "fixed",
    value: 50.00,
    min_purchase_amount: 100.00,
    min_quantity: 1,
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    max_uses: 100,
    used_count: 12,
    scope: "subscription",
    product_id: null,
    is_active: true,
  },
];

export const initialSubscriptions: Subscription[] = [
  {
    id: "sub-00101",
    subscription_number: "SUB-00101",
    customer_id: "u-cust-01",
    plan_id: "plan-yearly-ent",
    status: "active",
    start_date: "2026-01-01",
    expiry_date: "2027-01-01",
    next_billing_date: "2026-11-01",
    payment_terms: "Net 30 Days",
    health_score: 95,
    health_label: "healthy",
    notes: "Enterprise contract for Acme Corp with Enterprise brand variant.",
    created_at: "2026-01-01T09:00:00Z",
    lines: [
      {
        id: "sline-01",
        subscription_id: "sub-00101",
        product_id: "prod-01",
        variant_id: "var-02",
        quantity: 5,
        unit_price: 680.00, // 120 base + 560 Enterprise brand
        tax_rate: 10.00,
        subtotal: 3400.00,
        total: 3740.00,
      },
      {
        id: "sline-02",
        subscription_id: "sub-00101",
        product_id: "prod-02",
        quantity: 1,
        unit_price: 49.00,
        tax_rate: 10.00,
        subtotal: 49.00,
        total: 53.90,
      },
    ],
  },
  {
    id: "sub-00102",
    subscription_number: "SUB-00102",
    customer_id: "u-cust-02",
    plan_id: "plan-monthly-std",
    status: "active",
    start_date: "2026-09-15",
    expiry_date: "2027-09-15",
    next_billing_date: "2026-10-15", // Past due billing date to demonstrate overdue/billing day!
    payment_terms: "Immediate Payment",
    health_score: 55,
    health_label: "at-risk",
    notes: "Corner Cafe standard monthly shop license.",
    created_at: "2026-09-15T11:30:00Z",
    lines: [
      {
        id: "sline-03",
        subscription_id: "sub-00102",
        product_id: "prod-01",
        variant_id: "var-01",
        quantity: 1,
        unit_price: 120.00,
        tax_rate: 10.00,
        subtotal: 120.00,
        total: 132.00,
      },
    ],
  },
  {
    id: "sub-00103",
    subscription_number: "SUB-00103",
    customer_id: "u-cust-01",
    plan_id: "plan-weekly-flex",
    status: "quotation",
    start_date: "2026-11-05",
    expiry_date: "2026-12-05",
    next_billing_date: "2026-11-05",
    payment_terms: "Immediate Payment",
    health_score: 100,
    health_label: "healthy",
    notes: "Quotation offer sent to Acme for temporary QA project team.",
    created_at: "2026-10-25T14:00:00Z",
    lines: [
      {
        id: "sline-04",
        subscription_id: "sub-00103",
        product_id: "prod-01",
        quantity: 2,
        unit_price: 120.00,
        tax_rate: 10.00,
        subtotal: 240.00,
        total: 264.00,
      },
    ],
  },
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-2026-0001",
    invoice_number: "INV-2026-0001",
    subscription_id: "sub-00101",
    customer_id: "u-cust-01",
    issue_date: "2026-10-01",
    due_date: "2026-10-31",
    status: "paid",
    subtotal_amount: 3449.00,
    tax_amount: 344.90,
    discount_amount: 0.00,
    total_amount: 3793.90,
    balance_due: 0.00,
    billing_cycle_start: "2026-10-01",
    billing_cycle_end: "2026-10-31",
    payments: [
      {
        id: "pay-01",
        invoice_id: "inv-2026-0001",
        payment_method: "bank_transfer",
        amount: 3793.90,
        payment_date: "2026-10-10",
        transaction_reference: "WIRE-ACH-88921",
        notes: "Full payment received via corporate ACH wire.",
      },
    ],
  },
  {
    id: "inv-2026-0002",
    invoice_number: "INV-2026-0002",
    subscription_id: "sub-00102",
    customer_id: "u-cust-02",
    issue_date: "2026-10-15",
    due_date: "2026-10-25", // Overdue! (past due date)
    status: "confirmed",
    subtotal_amount: 120.00,
    tax_amount: 12.00,
    discount_amount: 0.00,
    total_amount: 132.00,
    balance_due: 132.00, // Still owed!
    billing_cycle_start: "2026-10-15",
    billing_cycle_end: "2026-11-14",
    payments: [],
  },
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "act-01",
    entity_type: "subscription",
    entity_id: "sub-00101",
    action: "status_change",
    message: "Subscription confirmed and activated with Enterprise Edition variant.",
    created_at: "2026-01-01T09:05:00Z",
  },
  {
    id: "act-02",
    entity_type: "invoice",
    entity_id: "inv-2026-0001",
    action: "payment_logged",
    message: "Payment of $3,793.90 recorded via Bank Transfer (Wire: WIRE-ACH-88921). Status moved to Paid.",
    created_at: "2026-10-10T11:20:00Z",
  },
];

// Helper to check live database tables or fallback gracefully
export async function fetchWithSupabaseFallback<T>(
  tableName: string,
  fallbackData: T[],
  selectQuery = "*"
): Promise<T[]> {
  try {
    const { data, error } = await supabaseAdmin.from(tableName).select(selectQuery);
    if (!error && data && data.length > 0) {
      return data as T[];
    }
  } catch {
    // Falls through to fallback data
  }
  return fallbackData;
}

