import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validatePassword } from "@/lib/utils";
import { initialProfiles } from "@/lib/data-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, company } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    // Password complexity policy validation:
    // "the password must be more than eight characters, with an uppercase letter, a lowercase letter and a special character"
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, error: validation.message }, { status: 400 });
    }

    // Call authentication backend to create the user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        name: name?.trim() || email.split("@")[0],
        company: company?.trim() || "Small Business",
        role: "customer", // New customer signs up with customer role
      },
    });

    if (authError) {
      // Account uniqueness rule: "Each email can belong to only one account"
      if (authError.message.toLowerCase().includes("already registered") || authError.message.toLowerCase().includes("unique")) {
        return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 409 });
      }
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;
    const userRole = "customer";

    // Record in profiles table
    try {
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email: email.trim().toLowerCase(),
        name: name?.trim() || email.split("@")[0],
        role: userRole,
        company_name: company?.trim() || null,
      });
    } catch {
      // Fallback in-memory profile
    }

    // Also update local data store profiles
    const newProfile = {
      id: userId,
      email: email.trim().toLowerCase(),
      name: name?.trim() || email.split("@")[0],
      role: userRole as "customer",
      company_name: company?.trim() || "Small Business",
      created_at: new Date().toISOString(),
    };
    initialProfiles.push(newProfile);

    const response = NextResponse.json({
      success: true,
      message: "Customer account created successfully.",
      user: {
        id: userId,
        email: email.trim().toLowerCase(),
        name: newProfile.name,
        role: userRole,
        company: newProfile.company_name,
      },
    });

    // Set auth cookie
    response.cookies.set("brightloop_user", JSON.stringify({
      id: userId,
      email: email.trim().toLowerCase(),
      name: newProfile.name,
      role: userRole,
      company: newProfile.company_name,
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Accessible to client for immediate UI update
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Signup error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

