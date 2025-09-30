// app/properties/[id]/Uploader.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

type Props = {
  propertyId: string;
  initialHasImages?: boolean;
};

export default function Uploader({ propertyId, initialHasImages = false }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [hide, setHide] = useState(initialHasImages);

  // Re-check on mount in case server count was stale
  useEffect(() => {
    (async () => {
      const { count, error } = await supabase
        .from('property_images')                    // TABLE (underscore)
        .select('id', { count: 'exact', head: true })
        .eq('property_id', propertyId);

      // Debug visibility:
      console.log('uploader check', { propertyId, count, error });

      if (!error && (count ?? 0) > 0) setHide(true);
    })();
  }, [propertyId]);

  const upload = async () => {
    if (!file || busy) return;
    setBusy(true);
    setMsg('');

    try {
      // optional sanity: ensure property exists
      const chk = await supabase.from('properties').select('id').eq('id', propertyId).single();
      if (chk.error) throw new Error(`Property not found: ${chk.error.message}`);

      // block formats the browser can’t preview (like HEIC)
      const allowed = /image\/(jpeg|png|webp)/i.test(file.type);
      if (!allowed) throw new Error('Please upload JPEG/PNG/WebP');

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const key = `property-${propertyId}/${crypto.randomUUID()}.${ext}`;

      // 1) upload to Storage (BUCKET uses dash)
      const up = await supabase.storage
        .from('property-images')
        .upload(key, file, { upsert: false, contentType: file.type || 'image/jpeg' });

      if (up.error) throw new Error(`Storage upload error: ${up.error.message}`);

      // 2) insert DB row (TABLE uses underscore)
      const ins = await supabase
        .from('property_images')
        .insert({ property_id: propertyId, path: key })
        .select('id')
        .single();

      if (ins.error) throw new Error(`DB insert error: ${ins.error.message}`);

      setMsg('Uploaded!');
      setFile(null);
      setHide(true);          // hide immediately after success
      router.refresh();       // let the grid reload
    } catch (e: any) {
      setMsg(e.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  if (hide) {
    return (
      <div className="rounded-md border p-3 bg-green-50 text-green-700">
        Image uploaded ✓
      </div>
    );
  }

  return (
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
  );
}
