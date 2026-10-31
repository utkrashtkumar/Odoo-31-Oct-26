# Brightloop Subscription Management System (Odoo 17+ Enterprise Edition)

A unified subscription, recurring billing, and revenue platform for Brightloop Software, built with **Next.js 14 (App Router)**, **TypeScript**, and **Supabase Cloud**.

Strictly engineered according to the requirements in [`Subscription_Management_System.pdf`](./Subscription_Management_System.pdf) and designed following the [Odoo ERP & CRM](https://www.odoo.com/) enterprise aesthetic.

---

## 🌟 Key Features & PDF Compliance

### 1. Products, Brand Variants & Pricing Plans
- **Catalog Management**: Name, type (`software_license`, `add_on`, `service`), sales price, cost price, and notes.
- **Brand Variant Surcharges**: Specific support for brand variants such as **Odoo Enterprise Edition** adding **+$560** to the base price.
- **Flexible Plans**: Daily, weekly, monthly, and yearly intervals with minimum quantity rules and date validity windows.
- **Plan-by-Plan Lifecycle Rules**:
  - `auto_close`: Subscriptions close automatically when they end.
  - `allow_pause`: Customers or staff can pause active subscriptions.
  - `allow_early_close`: Close contract ahead of schedule.
  - `allow_renew`: Extend active contract terms.

### 2. Quotation to Subscription Pipeline
- **Quotation Templates**: Pre-configured plans and line items valid for a fixed number of days.
- **Sequential Odoo Chevron Pipeline**:
  $$\text{Draft} \longrightarrow \text{Quotation} \longrightarrow \text{Confirmed} \longrightarrow \text{Active} \longrightarrow \text{Closed}$$
- **Subscription Details**: Unique ID (`SUB-00101`), customer info, payment terms, and lines showing products, variants, quantities, unit prices, taxes, and amounts.

### 3. Automated Billing Day Engine
- **One-Click & Cron Automated Runs**: Batch generates invoices from active due subscriptions.
- **Zero Double-Billing Guarantee**: Idempotent billing cycle keys ensure no subscription is billed twice or skipped.
- **Automated Tax Rules**: Admin-defined percentage rules applied dynamically per line.
- **Invoice Lifecycle**: `Draft` ➔ `Confirmed` ➔ `Paid` (with PDF printing, email dispatch, and cancellation support).

### 4. Admin Discount Rules Engine
- Admin-governed rules supporting **Percentage** or **Fixed Amount** discounts.
- Constraints: minimum purchase amount, minimum seat quantity, start/end dates, and maximum usage counters.
- Automatically applied to the next invoice and automatically deactivated when limits expire.

### 5. Payment Reconciliation & Receivables
- Payments logged with **method** (Bank Transfer, Credit Card, Cash), **amount**, **date**, and **transaction reference note**.
- Real-time `balance_due` updates with automatic transition to `Paid` on settlement.
- **Overdue Aging Classifier**:
  - `1–15 days past due` (Amber badge)
  - `16–30 days past due` (Orange badge)
  - `30+ days past due` (Red badge)
- **One-Click Overdue Chase**: Dispatches payment reminders directly to customers.

### 6. Finance Lead Executive Dashboard (< 2s SLA)
Directly answers the 4 core business questions in one unified, real-time screen:
1. **How many subscriptions are active?**
2. **How much revenue came in?**
3. **How much is still owed?**
4. **Which invoices are overdue?**

### 7. Customer Self-Service Portal
- Responsive portal styled to the modern [odoo.com](https://www.odoo.com/) website theme.
- Isolated customer access to view active subscriptions, toggle add-ons, and download PDF receipts.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 Full-Stack (App Router + Server Actions)
- **Language**: TypeScript (Strict Mode)
- **Database & Backend**: Supabase Cloud (`https://gwrcsmbibwbgysggoixp.supabase.co`)
- **Arithmetic**: `decimal.js` arbitrary precision (Zero floating-point rounding errors)
- **Styling**: Tailwind CSS + Custom Odoo Enterprise Tokens (`#714B67` Purple, `#00A09D` Teal)
- **Icons**: Lucide React
- **Command Palette**: `cmdk` (⌘K fuzzy search across all models)

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portal and app launcher.

3. **Supabase Schema Setup**:
   The full PostgreSQL schema is available in [`supabase/schema.sql`](./supabase/schema.sql).
   Simply copy and run this in your [Supabase SQL Editor](https://supabase.com/dashboard/project/gwrcsmbibwbgysggoixp/sql/new) to set up all tables, enums, performance indexes, and Row Level Security (RLS) policies.

