import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const expected = process.env.OPS_TEMP_KEY;

    if (!expected) return NextResponse.json({ error: 'Missing env: OPS_TEMP_KEY' }, { status: 500 });
    if (key !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseAdmin = getSupabaseAdmin(); // <-- created at request-time

    const { data: leads, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id,property_id,full_name,phone,created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (leadErr) return NextResponse.json({ error: leadErr.message }, { status: 500 });

    const propertyIds = Array.from(new Set((leads ?? []).map((l) => l.property_id)));
    let propMap = new Map<string, any>();
    if (propertyIds.length) {
      const { data: props, error: propErr } = await supabaseAdmin
        .from('properties')
        .select('id,title,city,state,verification')
        .in('id', propertyIds);
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
    console.error('ops/leads GET error:', e);
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
