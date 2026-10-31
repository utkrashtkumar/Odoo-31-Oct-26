import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gwrcsmbibwbgysggoixp.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmNzbWJpYndiZ3lzZ2dvaXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTEyOTIsImV4cCI6MjEwODk4NzI5Mn0.ICRTKuu49qUOgQL-GJLXH1-chyt_6F4uzlNqfXV2-cs";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

