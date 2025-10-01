'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

type SortKey = 'new' | 'old' | 'priceAsc' | 'priceDesc';

export default function PropertiesPage() {
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('new');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Pull the fields you actually use in cards
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,city,state,hero_url,created_at,status,price')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        setRows([]);
      } else {
        setRows((data ?? []) as unknown as PropertyRow[]);
      }
      setLoading(false);
    };

    load();
  }, []);

  const sorted = useMemo(() => {
    const copy = [...rows];
    switch (sort) {
      case 'old':
        return copy.sort(
          (a, b) =>
            new Date(a.created_at ?? 0).getTime() -
            new Date(b.created_at ?? 0).getTime()
        );
      case 'priceAsc':
        return copy.sort(
          (a: any, b: any) => (a?.price ?? 0) - (b?.price ?? 0)
        );
      case 'priceDesc':
        return copy.sort(
          (a: any, b: any) => (b?.price ?? 0) - (a?.price ?? 0)
        );
      case 'new':
      default:
        return copy.sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime()
        );
    }
  }, [rows, sort]);

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Properties</h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
          <option value="priceAsc">Price: Low → High</option>
          <option value="priceDesc">Price: High → Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : sorted.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <PropertyCard key={p.id ?? Math.random()} property={p} />
          ))}
        </div>
      )}
    </main>
  );
}
