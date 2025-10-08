import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // Prefer NEXT_PUBLIC_*; also accept SUPABASE_URL/SUPABASE_ANON_KEY if you used those.
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    '';
  const rawAnon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    '';

  const url = rawUrl.trim();
  const anon = rawAnon.trim();

  const env = process.env.VERCEL_ENV || 'unknown'; // 'production' | 'preview' | 'development'

  // Also expose "presence" booleans for debugging on the page
  return NextResponse.json({
    url: url || null,
    anon: anon || null,
    env,
    present: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    },
  });
}
