// app/browse/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

export default function BrowsePage() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(null);
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,city,state,hero_url,created_at,verification')
        .order('created_at', { ascending: false })
        .limit(60); // show more on browse

      if (error) {
        console.error('Browse load error:', error);
        setErr(error.message ?? 'Failed to load properties');
        setProperties([]);
      } else {
        const rows = (data ?? []).map((p: any) => ({
          id: p.id,
          title: p.title,
          city: p.city,
          state: p.state,
          hero_url: p.hero_url,
          created_at: p.created_at,
          status: p.verification ? 'VERIFIED' : 'PENDING',
        })) as PropertyRow[];
        setProperties(rows);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Browse Properties</h1>

      {loading && <p>Loading…</p>}
      {!loading && err && (
        <p className="text-red-600">Error: {err}</p>
      )}
      {!loading && !err && properties.length === 0 && (
        <p>No properties found.</p>
      )}
      {!loading && !err && properties.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </main>
  );
}
