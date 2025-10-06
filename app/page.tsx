'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

export default function Home() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(false); // NEW: safe additive filter
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);

    // Base query (NOTE: we now select 'verification' as well)
    let query = supabase
      .from('properties')
      .select('id,title,city,state,hero_url,created_at,verification')
      .order('created_at', { ascending: false });

    // Optional filter: verified only
    if (verifiedOnly) {
      query = query.eq('verification', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading properties:', error);
      setErrorMsg(error.message);
      setProperties([]);
    } else {
      // Cast to PropertyRow (backward-compatible: PropertyCard can use status or verification)
      setProperties((data ?? []) as unknown as PropertyRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifiedOnly]); // re-fetch when toggle changes

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gray-50 border-b">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-4xl font-bold">
            Land deals you can <span className="text-green-700">trust</span>.
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            BuyersChoice verifies documents and handles paperwork end-to-end so
            you can buy land with confidence.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/properties"
              className="rounded bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              Browse verified listings
            </Link>
            <Link
              href="/seller"
              className="rounded border px-5 py-2 hover:bg-gray-100"
            >
              List your property
            </Link>
          </div>

          {/* Value Props */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                t: 'Verification',
                d: 'Background checks and paperwork validation by our ops team',
              },
              {
                t: 'Transparency',
                d: 'Clear status and updates for every listed property',
              },
              {
                t: 'End-to-End Assistance',
                d: 'From site visit to registration—handled with care',
              },
            ].map(({ t, d }) => (
              <div
                key={t}
                className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="text-lg font-semibold">{t}</div>
                <div className="mt-2 text-gray-600 text-sm">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Properties */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Properties</h2>

          {/* NEW: Verified-only toggle (additive, won’t break existing flows) */}
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            <span>Verified only</span>
          </label>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : errorMsg ? (
          <p className="text-red-600 text-sm">Error: {errorMsg}</p>
        ) : properties.length === 0 ? (
          <p>No properties yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
