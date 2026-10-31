"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (email: string, role?: UserRole, name?: string, company?: string) => void;
  signOut: () => void;
  switchRole: (role: UserRole) => void;
}

const defaultAdminUser: AuthUser = {
  id: "u-admin-01",
  email: "admin@odoo.com",
  name: "Alex Vance (Admin)",
  role: "admin",
  company: "Odoo S.A.",
};

const defaultStaffUser: AuthUser = {
  id: "u-staff-01",
  email: "sarah.rep@odoo.com",
  name: "Sarah Jenkins (Staff)",
  role: "staff",
  company: "Odoo S.A.",
};

const defaultCustomerUser: AuthUser = {
  id: "u-cust-01",
  email: "billing@acmecorp.com",
  name: "Marcus Sterling (Customer)",
  role: "customer",
  company: "Acme Enterprises Inc.",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "customer",
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("odoo_active_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore parse error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = (
    email: string,
    role: UserRole = "customer",
    name?: string,
    company?: string
  ) => {
    const newUser: AuthUser = {
      id: `u-${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      role,
      company: company || (role === "customer" ? "Client Business" : "Odoo S.A."),
    };
    setUser(newUser);
    localStorage.setItem("odoo_active_user", JSON.stringify(newUser));
    document.cookie = `odoo_user=${encodeURIComponent(JSON.stringify(newUser))}; path=/; max-age=604800`;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("odoo_active_user");
    document.cookie = "odoo_user=; path=/; max-age=0";
    window.location.href = "/";
  };

  const switchRole = (newRole: UserRole) => {
    let targetUser: AuthUser;
    let targetPath = "/dashboard";

    if (newRole === "admin") {
      targetUser = defaultAdminUser;
      targetPath = "/dashboard";
    } else if (newRole === "staff") {
      targetUser = defaultStaffUser;
      targetPath = "/subscriptions";
    } else {
      targetUser = defaultCustomerUser;
      targetPath = "/portal";
    }

    setUser(targetUser);
    localStorage.setItem("odoo_active_user", JSON.stringify(targetUser));
    document.cookie = `odoo_user=${encodeURIComponent(JSON.stringify(targetUser))}; path=/; max-age=604800`;
    
    // Direct clean navigation to target role landing page
    window.location.href = targetPath;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "customer",
        isLoading,
        signIn,
        signOut,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
