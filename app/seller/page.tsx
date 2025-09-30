'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

type UpState = 'idle' | 'uploading' | 'uploaded' | 'error';

export default function SellerPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePublicUrl, setImagePublicUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UpState>('idle');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      city.trim().length > 0 &&
      stateField.trim().length > 0 &&
      (typeof price === 'number' || price === '') &&
      imagePublicUrl &&
      uploadState === 'uploaded'
    );
  }, [title, city, stateField, price, imagePublicUrl, uploadState]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setErr(null);
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      setImagePublicUrl(null);
      setUploadState('idle');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(f.type)) {
      setErr('Please upload a JPG/PNG/WEBP image.');
      return;
    }
    const maxSizeMB = 5;
    if (f.size > maxSizeMB * 1024 * 1024) {
      setErr(`Image too large. Max ${maxSizeMB} MB.`);
      return;
    }
    setFile(f);
    setImagePublicUrl(null);
    setUploadState('idle');
  }

  async function uploadImage() {
    if (!file) {
      setErr('Choose an image to upload.');
      return;
    }
    setErr(null);
    setUploadState('uploading');

    try {
      const supabase = getSupabaseClient();

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `heroes/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage.from('property-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from('property-images').getPublicUrl(path);
      const publicUrl = data?.publicUrl ?? null;
      if (!publicUrl) throw new Error('Could not get public URL. Ensure bucket is Public.');

      setImagePublicUrl(publicUrl);
      setUploadState('uploaded');
    } catch (e: any) {
      setUploadState('error');
      setErr(e?.message ?? 'Upload failed');
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (uploadState !== 'uploaded' || !imagePublicUrl) {
      setErr('Please upload the image first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title,
          city,
          state: stateField,
          price: typeof price === 'string' ? null : price,
          hero_url: imagePublicUrl,
          verification: false,
        })
        .select('id')
        .single();

      if (error) throw error;
      router.push(`/properties/${data!.id}`);
    } catch (e: any) {
      setErr(e?.message ?? 'Submit failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetImage() {
    setFile(null);
    setPreviewUrl(null);
    setImagePublicUrl(null);
    setUploadState('idle');
  }

  return (
    <main className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">List your property</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input className="w-full rounded-lg border p-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input className="w-full rounded-lg border p-2" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input className="w-full rounded-lg border p-2" value={stateField} onChange={(e) => setStateField(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            className="w-full rounded-lg border p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            min={0}
          />
        </div>

        {/* Image uploader */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Hero Image</label>
          <input type="file" accept="image/*" onChange={pickFile} />
          {previewUrl && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg border" />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={uploadImage}
              disabled={!file || uploadState === 'uploading' || uploadState === 'uploaded'}
              className="rounded-lg bg-gray-900 text-white px-3 py-2 disabled:opacity-60"
            >
              {uploadState === 'uploading' ? 'Uploading…' : uploadState === 'uploaded' ? 'Uploaded ✓' : 'Upload Image'}
            </button>
            {uploadState === 'uploaded' && (
              <>
                <span className="text-sm text-green-700">Image ready</span>
                <button type="button" onClick={resetImage} className="text-sm underline">
                  Change image
                </button>
              </>
            )}
          </div>

          {imagePublicUrl && <p className="text-xs text-gray-600 break-all">URL: {imagePublicUrl}</p>}
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button type="submit" disabled={!canSubmit || isSubmitting} className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60">
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </main>
  );
}
