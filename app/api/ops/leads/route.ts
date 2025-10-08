import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isKeyOK(req: Request) {
  if (process.env.NODE_ENV !== 'production') return true; // dev bypass
  const url = new URL(req.url);
  const provided = (url.searchParams.get('key') || '').trim();
  const expected = (process.env.OPS_TEMP_KEY || '').trim();
  return !!(expected && provided && provided === expected);
}

export async function GET(req: Request) {
  if (!isKeyOK(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json(
      { error: 'SERVER_NOT_CONFIGURED: missing SUPABASE_SERVICE_ROLE_KEY' },
      { status: 501 }
    );
  }

  try {
    const admin = getSupabaseAdmin();

    const { data: leads, error: leadErr } = await admin
      .from('leads')
      .select('id, property_id, full_name, phone, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (leadErr) return NextResponse.json({ error: leadErr.message }, { status: 500 });

    const ids = Array.from(new Set((leads ?? []).map((l) => l.property_id)));
    let propMap = new Map<string, any>();

    if (ids.length) {
      const { data: props, error: propErr } = await admin
        .from('properties')
        .select('id, title, city, state, verification')
        .in('id', ids);
      if (propErr) return NextResponse.json({ error: propErr.message }, { status: 500 });
      propMap = new Map(props!.map((p: any) => [p.id, p]));
    }

    const rows = (leads ?? []).map((l) => ({
      id: l.id,
      created_at: l.created_at,
      full_name: l.full_name,
      phone: l.phone,
      property_id: l.property_id,
      property: propMap.get(l.property_id) || null,
    }));

    return NextResponse.json({ rows });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
