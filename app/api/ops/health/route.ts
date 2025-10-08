import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const provided = (url.searchParams.get('key') || '').trim();

  const isProd = process.env.NODE_ENV === 'production';
  const expected = (process.env.OPS_TEMP_KEY || '').trim();

  const ok = isProd
    ? !!(expected && provided && provided === expected)
    : true; // dev bypass

  return NextResponse.json({
    ok,
    provided: provided.length > 0,
    expectedSet: isProd ? expected.length > 0 : true,
    env: process.env.VERCEL_ENV || 'development',
    devBypass: !isProd,
  });
}
