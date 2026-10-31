export type UserRole = "admin" | "staff" | "customer";
export type ProductType = "service" | "software_license" | "add_on";
export type BillingInterval = "daily" | "weekly" | "monthly" | "yearly";
export type SubscriptionStatus = "draft" | "quotation" | "confirmed" | "active" | "paused" | "closed";
export type InvoiceStatus = "draft" | "confirmed" | "paid" | "cancelled";
export type DiscountType = "fixed" | "percentage";
export type DiscountScope = "product" | "subscription";
export type PaymentMethod = "bank_transfer" | "credit_card" | "cash" | "stripe";
export type CreditNoteStatus = "draft" | "confirmed" | "applied";

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  company_name?: string | null;
  address?: string | null;
  created_at: string;
}

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
  is_default: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  attribute_name: string; // e.g. "Brand"
  attribute_value: string; // e.g. "Enterprise Edition"
  price_surcharge: number; // e.g. 560
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  sales_price: number;
  cost_price: number | null;
  notes: string | null;
  is_active: boolean;
  variants?: ProductVariant[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billing_interval: BillingInterval;
  min_quantity: number;
  valid_from: string | null;
  valid_until: string | null;
  auto_close: boolean;
  allow_pause: boolean;
  allow_early_close: boolean;
  allow_renew: boolean;
  grace_period_days: number;
  is_active: boolean;
}

export interface QuotationTemplateItem {
  id: string;
  template_id: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  discount_rate: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface QuotationTemplate {
  id: string;
  name: string;
  plan_id: string;
  validity_days: number;
  notes?: string | null;
  plan?: Plan;
  items?: QuotationTemplateItem[];
}

export interface TaxRule {
  id: string;
  name: string;
  rate_percentage: number;
  is_active: boolean;
}

export interface Discount {
  id: string;
  code: string;
  discount_type: DiscountType;
  value: number;
  min_purchase_amount: number;
  min_quantity: number;
  start_date: string | null;
  end_date: string | null;
  max_uses: number | null;
  used_count: number;
  scope: DiscountScope;
  product_id: string | null;
  is_active: boolean;
}

export interface SubscriptionLine {
  id: string;
  subscription_id: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  subtotal: number;
  total: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Subscription {
  id: string;
  subscription_number: string;
  customer_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string | null;
  expiry_date: string | null;
  next_billing_date: string | null;
  payment_terms: string;
  discount_id?: string | null;
  health_score: number;
  health_label: "healthy" | "at-risk" | "critical";
  notes?: string | null;
  created_at: string;
  customer?: Profile;
  plan?: Plan;
  discount?: Discount;
  lines?: SubscriptionLine[];
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  product_id?: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rule_id?: string | null;
  tax_amount: number;
  subtotal: number;
  total: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  payment_method: PaymentMethod;
  amount: number;
  payment_date: string;
  transaction_reference?: string | null;
  notes?: string | null;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  subscription_id: string;
  customer_id: string;
  currency_id?: string | null;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  balance_due: number;
  billing_cycle_start: string;
  billing_cycle_end: string;
  pdf_url?: string | null;
  customer?: Profile;
  subscription?: Subscription;
  lines?: InvoiceLine[];
  payments?: Payment[];
}

export interface ActivityLog {
  id: string;
  user_id?: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  message: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  created_at: string;
  user?: Profile;
}

