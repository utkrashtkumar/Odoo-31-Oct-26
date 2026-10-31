-- =====================================================================
-- BRIGHTLOOP SUBSCRIPTION MANAGEMENT SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Inspired by Odoo Enterprise Data Model
-- Based on Subscription_Management_System.pdf
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_type AS ENUM ('service', 'software_license', 'add_on');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_interval AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('draft', 'quotation', 'confirmed', 'active', 'paused', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'confirmed', 'paid', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('fixed', 'percentage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_scope AS ENUM ('product', 'subscription');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('bank_transfer', 'credit_card', 'cash', 'stripe');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE credit_note_status AS ENUM ('draft', 'confirmed', 'applied');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email CITEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    phone TEXT,
    company_name TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CURRENCIES TABLE
CREATE TABLE IF NOT EXISTS public.currencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    name TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS TABLE (with sales/cost prices & notes)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type product_type NOT NULL DEFAULT 'software_license',
    sales_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cost_price NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCT VARIANTS TABLE (e.g., Odoo Brand +$560)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    attribute_name TEXT NOT NULL, -- e.g. "Brand"
    attribute_value TEXT NOT NULL, -- e.g. "Odoo"
    price_surcharge NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- e.g. +560.00
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TAX RULES TABLE
CREATE TABLE IF NOT EXISTS public.tax_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g. "Standard Sales Tax (10%)"
    rate_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PLANS TABLE (with lifecycle flags: auto_close, pause, renew, intervals)
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    billing_interval billing_interval NOT NULL DEFAULT 'monthly',
    min_quantity INT NOT NULL DEFAULT 1,
    valid_from DATE,
    valid_until DATE,
    auto_close BOOLEAN NOT NULL DEFAULT FALSE,
    allow_pause BOOLEAN NOT NULL DEFAULT TRUE,
    allow_early_close BOOLEAN NOT NULL DEFAULT FALSE,
    allow_renew BOOLEAN NOT NULL DEFAULT TRUE,
    grace_period_days INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. QUOTATION TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.quotation_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
    validity_days INT NOT NULL DEFAULT 30,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. QUOTATION TEMPLATE LINES
CREATE TABLE IF NOT EXISTS public.quotation_template_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.quotation_templates(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    discount_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. DISCOUNTS TABLE (Admin only rules)
CREATE TABLE IF NOT EXISTS public.discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type discount_type NOT NULL DEFAULT 'percentage',
    value NUMERIC(12, 2) NOT NULL, -- percentage (e.g. 15.00) or fixed amount
    min_purchase_amount NUMERIC(12, 2) DEFAULT 0.00,
    min_quantity INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    max_uses INT,
    used_count INT NOT NULL DEFAULT 0,
    scope discount_scope NOT NULL DEFAULT 'subscription',
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. "SUB-00101"
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
    status subscription_status NOT NULL DEFAULT 'draft',
    start_date DATE,
    expiry_date DATE,
    next_billing_date DATE,
    payment_terms TEXT DEFAULT 'Immediate Payment',
    discount_id UUID REFERENCES public.discounts(id) ON DELETE SET NULL,
    health_score INT NOT NULL DEFAULT 100,
    health_label VARCHAR(20) NOT NULL DEFAULT 'healthy',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. SUBSCRIPTION LINES TABLE
CREATE TABLE IF NOT EXISTS public.subscription_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. "INV-2026-0001"
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    currency_id UUID REFERENCES public.currencies(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    subtotal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    billing_cycle_start DATE NOT NULL,
    billing_cycle_end DATE NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. INVOICE LINES TABLE
CREATE TABLE IF NOT EXISTS public.invoice_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_rule_id UUID REFERENCES public.tax_rules(id) ON DELETE SET NULL,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    payment_method payment_method NOT NULL DEFAULT 'bank_transfer',
    amount NUMERIC(12, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. CREDIT NOTES TABLE
CREATE TABLE IF NOT EXISTS public.credit_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credit_note_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. "CN-2026-0001"
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    reason TEXT NOT NULL,
    status credit_note_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. ODOO CHATTER / AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    entity_type VARCHAR(50) NOT NULL, -- "subscription", "invoice", "payment", etc.
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- "status_change", "log_note", "send_message", "payment_logged"
    message TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- PERFORMANCE INDEXES (Guarantees Sub-2s Response Times)
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_subs_billing ON public.subscriptions (status, next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subs_customer ON public.subscriptions (customer_id, status);
CREATE INDEX IF NOT EXISTS idx_subs_health ON public.subscriptions (health_label, status);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices (status, due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON public.invoices (customer_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_sub_cycle ON public.invoices (subscription_id, billing_cycle_start);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON public.payments (invoice_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_chatter_entity ON public.activity_logs (entity_type, entity_id, created_at DESC);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_template_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin or staff
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users see own profile, Staff/Admin see all
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_staff_or_admin());

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (auth.uid() = id OR public.is_staff_or_admin());

-- Catalog (Products, Variants, Plans, Taxes): Everyone can view, only staff/admin can modify
CREATE POLICY "catalog_select_policy" ON public.products FOR SELECT USING (true);
CREATE POLICY "catalog_modify_policy" ON public.products FOR ALL USING (public.is_staff_or_admin());

CREATE POLICY "variants_select_policy" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "variants_modify_policy" ON public.product_variants FOR ALL USING (public.is_staff_or_admin());

CREATE POLICY "plans_select_policy" ON public.plans FOR SELECT USING (true);
CREATE POLICY "plans_modify_policy" ON public.plans FOR ALL USING (public.is_staff_or_admin());

CREATE POLICY "taxes_select_policy" ON public.tax_rules FOR SELECT USING (true);
CREATE POLICY "taxes_modify_policy" ON public.tax_rules FOR ALL USING (public.is_staff_or_admin());

-- Discounts: Everyone sees active discounts (for code lookup), only admin/staff can modify
CREATE POLICY "discounts_select_policy" ON public.discounts FOR SELECT USING (true);
CREATE POLICY "discounts_modify_policy" ON public.discounts FOR ALL USING (public.is_staff_or_admin());

-- Subscriptions: Customers see own, Staff/Admin see all
CREATE POLICY "subs_select_policy" ON public.subscriptions
FOR SELECT USING (customer_id = auth.uid() OR public.is_staff_or_admin());

CREATE POLICY "subs_modify_policy" ON public.subscriptions
FOR ALL USING (public.is_staff_or_admin());

CREATE POLICY "sub_lines_select_policy" ON public.subscription_lines
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.subscriptions s
        WHERE s.id = subscription_id AND (s.customer_id = auth.uid() OR public.is_staff_or_admin())
    )
);

CREATE POLICY "sub_lines_modify_policy" ON public.subscription_lines
FOR ALL USING (public.is_staff_or_admin());

-- Invoices: Customers see own, Staff/Admin see all
CREATE POLICY "invoices_select_policy" ON public.invoices
FOR SELECT USING (customer_id = auth.uid() OR public.is_staff_or_admin());

CREATE POLICY "invoices_modify_policy" ON public.invoices
FOR ALL USING (public.is_staff_or_admin());

CREATE POLICY "inv_lines_select_policy" ON public.invoice_lines
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.invoices i
        WHERE i.id = invoice_id AND (i.customer_id = auth.uid() OR public.is_staff_or_admin())
    )
);

CREATE POLICY "inv_lines_modify_policy" ON public.invoice_lines
FOR ALL USING (public.is_staff_or_admin());

-- Payments: Customers can see payments on own invoices, Staff/Admin can manage
CREATE POLICY "payments_select_policy" ON public.payments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.invoices i
        WHERE i.id = invoice_id AND (i.customer_id = auth.uid() OR public.is_staff_or_admin())
    )
);

CREATE POLICY "payments_modify_policy" ON public.payments
FOR ALL USING (public.is_staff_or_admin());

-- Chatter Activity Logs: Staff/Admin see all, customers see public notes
CREATE POLICY "activity_select_policy" ON public.activity_logs
FOR SELECT USING (public.is_staff_or_admin());

CREATE POLICY "activity_insert_policy" ON public.activity_logs
FOR INSERT WITH CHECK (public.is_staff_or_admin() OR auth.uid() = user_id);

-- =====================================================================
-- INITIAL SEED DATA (Default Currency, Odoo Brand Variant, Demo Plan)
-- =====================================================================
INSERT INTO public.currencies (code, symbol, name, is_default)
VALUES ('USD', '$', 'US Dollar', TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.tax_rules (name, rate_percentage, is_active)
VALUES 
    ('No Tax (0%)', 0.00, TRUE),
    ('Standard VAT (10%)', 10.00, TRUE),
    ('State Sales Tax (8.5%)', 8.50, TRUE)
ON CONFLICT DO NOTHING;

