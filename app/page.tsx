'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

export default function Home() {
  const [properties, setProperties] = useState<PropertyRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase
      .from('properties')
      .select('id,title,city,state,hero_url,created_at,verification,price')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        setProperties((data ?? []) as PropertyRow[]);
      });
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-3">Newest listings</h2>
        {err && <p className="text-sm text-red-600">{err}</p>}
        {properties === null ? (
          <p className="text-gray-500">Loading…</p>
        ) : properties.length === 0 ? (
          <p className="text-gray-500">No properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </main>
  );
}
