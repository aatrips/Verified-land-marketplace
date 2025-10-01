'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

export default function Home() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,city,state,hero_url,created_at,status')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
      } else {
        setProperties((data ?? []) as unknown as PropertyRow[]);
      }
      setLoading(false);
    };

    load();
  }, []);

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
        <h2 className="text-2xl font-semibold mb-6">Latest Properties</h2>
        {loading ? (
          <p>Loading…</p>
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
