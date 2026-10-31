import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Brightloop - Subscription Management System | Odoo Enterprise",
  description: "Unified recurring billing, subscription management, and revenue platform powered by Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-odoo-canvas text-[#212529]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
