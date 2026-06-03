import { createBrowserClient } from "@supabase/ssr";

// Map both standard env variables and Vercel Marketplace integration variables (POS_ prefix)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.POS_SUPABASE_URL;
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.POS_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_POS_SUPABASE_ANON_KEY;

export const createClient = () => {
  // Safe fallback if credentials are not configured in Vercel settings
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes("your-supabase") ||
    supabaseKey.includes("your-supabase")
  ) {
    return {
      from: () => ({
        select: () => Promise.resolve({ data: null, error: new Error("Supabase environment variables not configured.") })
      })
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
