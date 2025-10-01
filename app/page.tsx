// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

export default function Home() {
  const [properties, setProperties] = useState<PropertyRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const supabase = getSupabaseClient();

      let q = supabase
        .from('properties')
        .select('id,title,city,state,hero_url,created_at,verification,price')
        .order('created_at', { ascending: false })
        .limit(6);

      if (onlyVerified) q = q.eq('verification', true);

      const { data, error } = await q;
      if (error) throw error;
      setProperties((data ?? []) as PropertyRow[]);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyVerified]);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Newest listings</h2>

        {/* Verified-only toggle */}
        <label className="inline-flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
          />
          Verified only
        </label>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      {loading && !properties ? (
        <p className="text-gray-500">Loading…</p>
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No properties yet.</p>
      )}
    </main>
  );
}
