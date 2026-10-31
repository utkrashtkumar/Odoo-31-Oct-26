import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { UserRole } from "@/types";

// Standard demo accounts for instant evaluation
const DEMO_CREDENTIALS: Record<string, { role: UserRole; name: string; company: string }> = {
  "admin@odoo.com": {
    role: "admin",
    name: "Alex Vance (Admin)",
    company: "Odoo S.A.",
  },
  "sarah.rep@odoo.com": {
    role: "staff",
    name: "Sarah Jenkins (Sales Rep)",
    company: "Odoo S.A.",
  },
  "billing@acmecorp.com": {
    role: "customer",
    name: "Marcus Sterling (Acme Enterprises)",
    company: "Acme Enterprises Inc.",
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Instant check for official demo personas
    const demoUser = DEMO_CREDENTIALS[cleanEmail];
    if (demoUser) {
      const userData = {
        id: `demo-${demoUser.role}`,
        email: cleanEmail,
        name: demoUser.name,
        role: demoUser.role,
        company: demoUser.company,
      };

      const response = NextResponse.json({
        success: true,
        message: `Signed in as ${demoUser.role.toUpperCase()}.`,
        user: userData,
      });

      response.cookies.set("odoo_user", JSON.stringify(userData), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        sameSite: "lax",
      });

      return response;
    }

    // 2. Authenticate through live database auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message || "Invalid email or password." },
        { status: 401 }
      );
    }

    // Retrieve profile details
    let role: UserRole = "customer";
    let name = authData.user.user_metadata?.name || cleanEmail.split("@")[0];
    let company = authData.user.user_metadata?.company || "Client Company";

    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profile) {
        role = (profile.role as UserRole) || role;
        name = profile.name || name;
        company = profile.company_name || company;
      }
    } catch {
      // Continue with user metadata
    }

    const userData = {
      id: authData.user.id,
      email: cleanEmail,
      name,
      role,
      company,
    };

    const response = NextResponse.json({
      success: true,
      message: `Signed in as ${role.toUpperCase()}.`,
      user: userData,
    });

    response.cookies.set("odoo_user", JSON.stringify(userData), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Sign-in error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
