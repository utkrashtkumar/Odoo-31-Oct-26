import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Odoo - Subscription Management System",
  description: "Unified recurring billing, subscription management, and revenue platform.",
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
