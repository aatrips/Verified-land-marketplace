'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type FormState = {
  title: string;
  city: string;
  state: string;
  price?: number | '';
};

export default function SellerPage() {
  const [form, setForm] = useState<FormState>({
    title: '',
    city: '',
    state: '',
    price: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // price to number (or blank)
    if (name === 'price') {
      const v = value.trim() === '' ? '' : Number(value);
      setForm((f) => ({ ...f, price: (isNaN(v as number) ? '' : v) as any }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const sanitize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_.]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 64);

  const uploadImages = async (propertyIdForPath: string) => {
    if (!files || files.length === 0) return { heroUrl: null as string | null, allUrls: [] as string[] };

    // Limit to 3 files
    const selected = Array.from(files).slice(0, 3);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i];
      const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg';
      const base = sanitize(form.title || 'property');
      const path = `${propertyIdForPath}/${base}-${Date.now()}-${i}.${ext}`;

      // 1) Upload to Supabase Storage
      const { error: upErr } = await supabase.storage
        .from('property-images')
        .upload(path, f, { upsert: false });

      if (upErr) throw new Error(`Upload failed for ${f.name}: ${upErr.message}`);

      // 2) Get public URL
      const { data } = supabase.storage.from('property-images').getPublicUrl(path);
      if (!data?.publicUrl) throw new Error('Failed to get public URL for uploaded image');

      uploadedUrls.push(data.publicUrl);
    }

    const heroUrl = uploadedUrls[0] ?? null;
    return { heroUrl, allUrls: uploadedUrls };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    setErr(null);

    try {
      // Basic validation
      if (!form.title.trim()) throw new Error('Please enter title');
      if (!form.city.trim()) throw new Error('Please enter city');
      if (!form.state.trim()) throw new Error('Please enter state');

      // Pre-generate a temp id for path grouping (we’ll also have the DB id after insert)
      const tempId = crypto.randomUUID();

      // Upload images first (optional but UX-friendly)
      const { heroUrl, allUrls } = await uploadImages(tempId);

      // Insert property (verification=false)
      const payload: any = {
        title: form.title.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        price: form.price === '' ? null : Number(form.price),
        hero_url: heroUrl,             // main hero image
        verification: false,           // single-column truth
      };

      const { data: inserted, error: insErr } = await supabase
        .from('properties')
        .insert([payload])
        .select('id')
        .single();

      if (insErr) throw new Error(`Insert failed: ${insErr.message}`);
      const newId = inserted?.id as string;

      // (Optional) If you have property_images table and want to save additional images:
      // Comment this block out if you **don’t** have the table.
      // Insert remaining URLs (including hero) as child rows.
      try {
        if (allUrls.length > 0) {
          const rows = allUrls.map((url) => ({
            property_id: newId,
            path: url, // storing public URL is fine for MVP
          }));
          await supabase.from('property_images').insert(rows);
        }
      } catch (e) {
        // Non-fatal for MVP
        console.warn('Skipping property_images insert:', e);
      }

      setMsg('Property submitted. Our team will verify and publish soon.');
      // reset form
      setForm({ title: '', city: '', state: '', price: '' });
      setFiles(null);
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">List your property</h1>

      {msg && <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-green-800 text-sm">{msg}</div>}
      {err && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">Error: {err}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            placeholder="Premium residential plot near Ring Road"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">City *</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              placeholder="Pune"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State *</label>
            <input
              name="state"
              value={form.state}
              onChange={onChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              placeholder="MH"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Price (INR)</label>
          <input
            name="price"
            type="number"
            min={0}
            value={form.price as any}
            onChange={onChange}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            placeholder="2400000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Images (up to 3)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">First image will be used as the cover (hero).</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-5 py-2 text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit property'}
        </button>
      </form>
    </main>
  );
}
