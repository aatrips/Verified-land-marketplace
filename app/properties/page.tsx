'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Optional lightweight filters (safe additives)
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [q, setQ] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);

    let query = supabase
      .from('properties')
      .select('id,title,city,state,hero_url,verification,created_at') // <- no status
      .order('created_at', { ascending: false });

    if (verifiedOnly) query = query.eq('verification', true);

    // Simple client-side text filter after fetch (keeps DB query simple)
    const { data, error } = await query;

    if (error) {
      setErrorMsg(error.message);
      setProperties([]);
    } else {
      const rows = (data ?? []) as PropertyRow[];
      const filtered =
        q.trim().length === 0
          ? rows
          : rows.filter((r) => {
              const hay = `${r.title ?? ''} ${r.city ?? ''} ${r.state ?? ''}`.toLowerCase();
              return hay.includes(q.toLowerCase());
            });
      setProperties(filtered);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifiedOnly]);

  // Re-run client filter on keystrokes without refetch
  useEffect(() => {
    // debounce could be added if needed; for now re-use load for simplicity
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Browse Properties</h1>

        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, city, state"
            className="border rounded-lg px-3 py-2 text-sm w-64"
          />
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            <span>Verified only</span>
          </label>
        </div>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : errorMsg ? (
        <p className="text-red-600 text-sm">Error: {errorMsg}</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </main>
  );
}
