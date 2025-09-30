'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Row = { id: string; path: string };

export default function PropertyImagesClient({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [images, setImages] = useState<Row[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // Load images for this property
  const load = async () => {
    setMsg('');
    const { data, error } = await supabase
      .from('property_images')                 // TABLE (underscore)
      .select('id, path')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('read error', error);
      setMsg(`Load error: ${error.message}`);
      setImages([]);
      return;
    }
    setImages(data || []);
  };

  useEffect(() => { load(); }, [propertyId]);

  const hasAny = images.length > 0;

  const upload = async () => {
    if (!file || busy) return;
    setBusy(true);
    setMsg('');

    try {
      // sanity: ensure the property exists (optional but helpful)
      const chk = await supabase.from('properties').select('id').eq('id', propertyId).single();
      if (chk.error) throw new Error(`Property not found: ${chk.error.message}`);

      // block formats most browsers can’t preview (HEIC)
      if (!/image\/(jpeg|png|webp)/i.test(file.type)) {
        throw new Error('Please upload JPEG/PNG/WebP images');
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const key = `property-${propertyId}/${crypto.randomUUID()}.${ext}`;

      // 1) Upload to Storage (BUCKET name uses a dash)
      const up = await supabase.storage
        .from('property-images')
        .upload(key, file, { contentType: file.type || 'image/jpeg', upsert: false });
      if (up.error) throw new Error(`Storage upload error: ${up.error.message}`);

      // 2) Insert DB row (TABLE name uses an underscore)
      const ins = await supabase
        .from('property_images')
        .insert({ property_id: propertyId, path: key })
        .select('id')
        .single();
      if (ins.error) throw new Error(`DB insert error: ${ins.error.message}`);

      setMsg('Uploaded!');
      setFile(null);

      // Update local state so the UI knows we have images now (hides uploader)
      setImages((current) => [{ id: ins.data.id as string, path: key }, ...current]);

      // Optional: refresh any server components on the page
      router.refresh();
    } catch (e: any) {
      console.error(e);
      setMsg(e.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Uploader is shown only when there are zero images */}
      {!hasAny && (
        <div className="space-y-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            aria-label="Select image"
          />
          <button
            type="button"
            onClick={upload}
            disabled={!file || busy}
            className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {busy ? 'Uploading…' : 'Upload'}
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((img) => {
          const { data } = supabase.storage
            .from('property-images')            // BUCKET (dash)
            .getPublicUrl(img.path);
          const src = data?.publicUrl;
          return (
            <div key={img.id} className="border rounded-lg p-2">
              {src ? (
                <img
                  src={src}
                  alt="Property"
                  style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                />
              ) : (
                <div className="text-xs text-red-600">Could not build image URL</div>
              )}
              <code className="text-[10px] break-all">{img.path}</code>
            </div>
          );
        })}
      </div>

      {/* Manual refresh (useful while testing policies) */}
      <button type="button" onClick={load} className="px-2 py-1 text-sm rounded border">
        Refresh
      </button>
    </div>
  );
}
