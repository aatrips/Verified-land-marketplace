import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const keys = Object.keys(process.env).filter(k =>
    /SUPABASE|NEXT_PUBLIC|VERCEL_ENV/i.test(k)
  );
  const summary = Object.fromEntries(
    keys.map(k => [k, process.env[k] ? 'present' : 'missing'])
  );
  return NextResponse.json(summary);
}
