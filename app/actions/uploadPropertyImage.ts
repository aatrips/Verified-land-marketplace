'use server';

import { v4 as uuid } from 'uuid';
import { createServerSupabase } from '@/utils/supabase/server';

export async function uploadPropertyImage(propertyId: string, file: File) {
  if (!file || !propertyId) throw new Error('Missing file or propertyId');
  if (!file.type.startsWith('image/')) throw new Error('Only images allowed');
  const supabase = createServerSupabase();

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const key = `property-${propertyId}/${uuid()}.${ext}`;

  const { error: upErr } = await supabase
    .storage
    .from('property-images')
    .upload(key, file, { contentType: file.type || 'image/jpeg', upsert: false });

  if (upErr) throw upErr;

  const { error: dbErr } = await supabase
    .from('property_images')
    .insert({ property_id: propertyId, path: key });

  if (dbErr) {
    await supabase.storage.from('property-images').remove([key]);
    throw dbErr;
  }

  return { path: key };
}
