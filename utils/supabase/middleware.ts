import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Map both standard env variables and Vercel Marketplace integration variables (POS_ prefix)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.POS_SUPABASE_URL;
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.POS_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_POS_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Safe fallback if credentials are not configured in Vercel settings
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes("your-supabase") ||
    supabaseKey.includes("your-supabase")
  ) {
    return supabaseResponse;
  }

  createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return supabaseResponse
};
