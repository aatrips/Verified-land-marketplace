'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

type ImageRow = { id: string; path: string };

export default function TestUploader() {
  const [propertyId, setPropertyId] = useState(''); // paste an existing property id
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const loadImages = async (pid: string) => {
    const { data, error } = await supabase
      .from('property_images')
      .select('id, path')
      .eq('property_id', pid)
      .order('created_at', { ascending: false });
    if (!error) setImages(data || []);
  };

  const loadPropertyOnce = async (pid: string) => {
    setMsg('');
    // optional: verify property exists
    const { data, error } = await supabase
      .from('properties')
      .select('id, title')
      .eq('id', pid)
      .single();
    if (error) {
      setMsg('Property not found (check ID/policies).');
      setImages([]);
      return;
    }
    setMsg(`Loaded property: ${data?.title ?? pid}`);
    await loadImages(pid);
  };

  const upload = async () => {
    if (!file || !propertyId || busy) return;
    setBusy(true);
    setMsg('');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const key = `property-${propertyId}/${crypto.randomUUID()}.${ext}`;

      // 1) Upload to Storage
      const up = await supabase.storage
        .from('property-images')
        .upload(key, file, { upsert: false, contentType: file.type || 'image/jpeg' });
      if (up.error) throw up.error;

      // 2) Insert path row
      const ins = await supabase
        .from('property_images')
        .insert({ property_id: propertyId, path: key });
      if (ins.error) throw ins.error;

      setMsg('Uploaded!');
      setFile(null);
      await loadImages(propertyId);
    } catch (e: any) {
      setMsg(e.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  // Auto-load images if propertyId is already set in URL (?pid=...)
  useEffect(() => {
    const pid = new URLSearchParams(window.location.search).get('pid');
    if (pid) {
      setPropertyId(pid);
      loadPropertyOnce(pid);
    }
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Test Uploader</h1>

      <div style={{ marginTop: 12, display: 'grid', gap: 8, maxWidth: 520 }}>
        <label>
          Property ID
          <input
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            placeholder="paste a properties.id UUID"
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
          />
        </label>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => propertyId && loadPropertyOnce(propertyId)}
            disabled={!propertyId}
            style={{ padding: '8px 12px', borderRadius: 6, background: 'black', color: 'white' }}
          >
            Load
          </button>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={upload}
              disabled={!file || !propertyId || busy}
              style={{ padding: '8px 12px', borderRadius: 6, background: 'black', color: 'white' }}
            >
              {busy ? 'Uploading…' : 'Upload'}
            </button>
        </div>

        {msg && <p style={{ color: '#444' }}>{msg}</p>}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 12 }}>
        {images.map((img) => {
          const { data } = supabase.storage.from('property-images').getPublicUrl(img.path);
          const src = data?.publicUrl;
          if (!src) return null;
          return (
            <div key={img.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
              <img src={src} alt="Property" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
              <code style={{ fontSize: 10, wordBreak: 'break-all' }}>{img.path}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
