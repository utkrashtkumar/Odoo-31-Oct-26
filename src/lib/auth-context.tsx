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
  signIn: (email: string, role?: UserRole, name?: string) => void;
  signOut: () => void;
  switchRole: (role: UserRole) => void;
}

const defaultAdminUser: AuthUser = {
  id: "u-admin-01",
  email: "admin@brightloop.io",
  name: "Alex Vance (Admin)",
  role: "admin",
  company: "Brightloop Software Corp",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultAdminUser,
  role: "admin",
  isLoading: false,
  signIn: () => {},
  signOut: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(defaultAdminUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("brightloop_active_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = (email: string, role: UserRole = "customer", name?: string) => {
    const newUser: AuthUser = {
      id: `u-${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      role,
      company: role === "customer" ? "Client Business" : "Brightloop Software",
    };
    setUser(newUser);
    localStorage.setItem("brightloop_active_user", JSON.stringify(newUser));
    document.cookie = `brightloop_user=${JSON.stringify(newUser)}; path=/; max-age=604800`;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("brightloop_active_user");
    document.cookie = "brightloop_user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  const switchRole = (newRole: UserRole) => {
    let targetUser: AuthUser;
    if (newRole === "admin") {
      targetUser = defaultAdminUser;
    } else if (newRole === "staff") {
      targetUser = {
        id: "u-staff-01",
        email: "sarah.rep@brightloop.io",
        name: "Sarah Jenkins (Staff)",
        role: "staff",
        company: "Brightloop Software Corp",
      };
    } else {
      targetUser = {
        id: "u-cust-01",
        email: "billing@acmecorp.com",
        name: "Marcus Sterling (Customer)",
        role: "customer",
        company: "Acme Enterprises Inc.",
      };
    }
    setUser(targetUser);
    localStorage.setItem("brightloop_active_user", JSON.stringify(targetUser));
    document.cookie = `brightloop_user=${JSON.stringify(targetUser)}; path=/; max-age=604800`;
    
    // Redirect customer to portal, staff/admin to dashboard
    if (newRole === "customer") {
      window.location.href = "/portal";
    } else {
      window.location.href = "/subscriptions";
    }
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
