'use client';
import ShareButtons from '@/components/ShareButtons';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import VerificationBadge from '@/components/VerificationBadge';

type PRow = {
  id: string;
  title: string;
  city: string;
  state: string;
  hero_url?: string;
  status?: string;          // backward-compat
  verification?: boolean;   // single source of truth when present
  created_at?: string;
};

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<PRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error loading property:', error);
        setProperty(null);
      } else {
        setProperty(data as PRow);
      }
      setLoading(false);
    };

    load();
  }, [params.id]);

  if (loading) return <p className="p-6">Loading property…</p>;
  if (!property) return <p className="p-6">Property not found.</p>;

  // Prefer boolean verification when available; else fallback to status string
  const isVerified =
    typeof property.verification === 'boolean'
      ? property.verification
      : (property.status ?? '').toUpperCase() === 'VERIFIED';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
      <p className="text-gray-600 mb-4">
        {property.city}, {property.state}
      </p>

      {property.hero_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={property.hero_url}
          alt={property.title}
          className="rounded-xl mb-4 w-full max-w-2xl"
        />
      ) : (
        <div className="rounded-xl bg-gray-200 p-12 mb-4">No image</div>
      )}

      <VerificationBadge verified={isVerified} />

      <p className="text-sm text-gray-400 mt-4">
        Added: {property.created_at ? new Date(property.created_at).toLocaleString() : '—'}
      </p>

      {/* Share section (new) */}
      <div className="mt-6 rounded-xl border p-4">
        <div className="font-medium mb-2">Share this property</div>
        <ShareButtons
          id={property.id}
          title={property.title}
          city={property.city}
          state={property.state}
        />
      </div>
    </div>
  );
}
