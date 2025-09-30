// app/properties/[id]/ImageGrid.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

type Row = { id: string; path: string };

export default function ImageGrid({ propertyId }: { propertyId: string }) {
  const [images, setImages] = useState<Row[]>([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setMsg('');
    const { data, error } = await supabase
      .from('property_images') // TABLE (underscore)
      .select('id, path')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) {
      setMsg(`Load error: ${error.message}`);
      setImages([]);
      return;
    }
    setImages(data || []);
  };

  useEffect(() => {
    load();
  }, [propertyId]);

  return (
    <div className="space-y-2">
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <div className="grid grid-cols-2 gap-4">
        {images.map((img) => {
          const { data } = supabase
            .storage
            .from('property-images') // BUCKET (dash)
            .getPublicUrl(img.path);

          const src = data?.publicUrl;
          if (!src) return null;

          // Use <img> to avoid next/image config needs
          return (
            <div key={img.id} className="border rounded-lg p-2">
              <img
                src={src}
                alt="Property"
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
              />
              <code className="text-[10px] break-all">{img.path}</code>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={load}
        className="px-2 py-1 text-sm rounded border"
      >
        Refresh
      </button>
    </div>
  );
}
