import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
