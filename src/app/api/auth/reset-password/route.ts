import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Call Supabase Auth to generate/send reset link
    try {
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: cleanEmail,
      });

      if (error) {
        // If user not in Supabase Auth yet, return simulated success for security
        return NextResponse.json({
          success: true,
          message: `If an account with ${cleanEmail} exists, a password reset link has been dispatched to your inbox.`,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Password reset link sent to ${cleanEmail}. Check your inbox!`,
        actionUrl: data.properties?.action_link,
      });
    } catch {
      return NextResponse.json({
        success: true,
        message: `Password reset instructions dispatched to ${cleanEmail}.`,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Password reset error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
