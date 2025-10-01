'use client';

import { useEffect, useState } from 'react';
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
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Latest Properties</h1>
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
    </main>
  );
}
