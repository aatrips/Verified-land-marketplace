// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { createServerSupabase } from '@/utils/supabase/server';

export async function GET() {
  // Quick probe so you can open /api/upload in the browser
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const propertyId = form.get('propertyId') as string;
  const file = form.get('file') as File;

  if (!propertyId || !file) {
    return NextResponse.json({ error: 'Missing propertyId or file' }, { status: 400 });
  }
  if (!file.type?.startsWith('image/')) {
    return NextResponse.json({ error: 'Only images allowed' }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const key = `property-${propertyId}/${uuid()}.${ext}`;

  const { error: upErr } = await supabase
    .storage.from('property-images')
    .upload(key, file, { contentType: file.type || 'image/jpeg', upsert: false });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  const { error: dbErr } = await supabase
    .from('property_images')
    .insert({ property_id: propertyId, path: key });

  if (dbErr) {
    await supabase.storage.from('property-images').remove([key]);
    return NextResponse.json({ error: dbErr.message }, { status: 400 });
  }

  return NextResponse.json({ path: key });
}
