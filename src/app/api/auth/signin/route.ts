import { NextResponse } from "next/server";
import { initialProfiles } from "@/lib/data-store";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Please provide both email and password." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check predefined profiles first for instant demo evaluation
    const matchedProfile = initialProfiles.find((p) => p.email.toLowerCase() === cleanEmail);

    let userId = matchedProfile ? matchedProfile.id : null;
    let userName = matchedProfile ? matchedProfile.name : cleanEmail.split("@")[0];
    let userRole = matchedProfile ? matchedProfile.role : "customer";
    let companyName = matchedProfile?.company_name || "Odoo Account";

    // If not in demo list, verify with authentication service
    if (!matchedProfile) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        return NextResponse.json({ success: false, error: authError.message }, { status: 401 });
      }

      userId = authData.user.id;
      userName = authData.user.user_metadata?.name || cleanEmail.split("@")[0];
      userRole = authData.user.user_metadata?.role || "customer";
      companyName = authData.user.user_metadata?.company || "Odoo Customer";
    }

    const userData = {
      id: userId,
      email: cleanEmail,
      name: userName,
      role: userRole,
      company: companyName,
    };

    const response = NextResponse.json({
      success: true,
      message: `Signed in as ${userRole.toUpperCase()}.`,
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

