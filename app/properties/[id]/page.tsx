'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import VerificationBadge from '@/components/VerificationBadge';

type PRow = {
  id: string;
  title: string;
  city: string;
  state: string;
  hero_url: string | null;
  created_at: string;
  verification: boolean;
  price?: number | null;
  // description?: string | null; // not selecting it anymore
};

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [p, setP] = useState<PRow | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase
      .from('properties')
      .select('id,title,city,state,hero_url,created_at,verification,price') // removed description
      .eq('id', params.id)
      .single()
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        setP(data as PRow);
      });
  }, [params.id]);

  if (err) return <main><p className="text-red-600">{err}</p></main>;
  if (!p) return <main><p className="text-gray-500">Loading…</p></main>;

  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <VerificationBadge verified={p.verification} />
        </div>
        <p className="text-sm text-gray-600">{p.city}, {p.state}</p>
      </div>

      <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.hero_url ? (
          <img src={p.hero_url} alt={p.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-sm text-gray-500">No image</div>
        )}
      </div>

      {typeof p.price === 'number' && (
        <p className="text-lg font-semibold">Price: ₹ {p.price.toLocaleString('en-IN')}</p>
      )}
    </main>
  );
}
