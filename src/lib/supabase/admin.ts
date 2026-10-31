import { createClient } from "@supabase/supabase-js";

// Polyfill WebSocket for Node.js 20 environment if not present
if (typeof window === "undefined" && typeof globalThis.WebSocket === "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ws = require("ws");
    globalThis.WebSocket = ws;
  } catch {
    // Ignore if not in Node
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gwrcsmbibwbgysggoixp.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmNzbWJpYndiZ3lzZ2dvaXhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQxMTI5MiwiZXhwIjoyMTA4OTg3MjkyfQ.hB8iR6Geel62T9gvhgIYSB73R9ceAtaUbKu0BksFtjI";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
