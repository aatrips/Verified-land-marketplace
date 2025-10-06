'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import InterestForm from '@/components/InterestForm';
import ShareButtons from '@/components/ShareButtons';

export type PropertyRow = {
  id?: string;
  title?: string;
  city?: string;
  state?: string;
  hero_url?: string;
  verification?: boolean; // preferred
  status?: string;        // backward-compat
  created_at?: string;
};

export default function PropertyCard({ property }: { property: PropertyRow }) {
  // Always declare hooks first (no early returns before hooks)
  const [showForm, setShowForm] = useState(false);
  const [interested, setInterested] = useState(false);

  // Derive id safely for hooks & handlers
  const id = property?.id ?? null;

  // Load "already interested" flag from localStorage after mount
  useEffect(() => {
    if (!id) return; // safe guard inside the hook, not outside
    try {
      const v = localStorage.getItem(`lead:${id}`);
      setInterested(!!v);
    } catch {
      /* no-op */
    }
  }, [id]);

  // Determine verification label without returning early
  const verificationLabel =
    typeof property?.verification === 'boolean'
      ? property?.verification
        ? 'VERIFIED'
        : 'PENDING'
      : property?.status || 'Pending';

  const verificationClass =
    verificationLabel === 'VERIFIED'
      ? 'text-green-600'
      : verificationLabel === 'PENDING' || verificationLabel === 'Pending'
      ? 'text-yellow-600'
      : 'text-gray-400';

  const handleInterestSuccess = () => {
    if (!id) return;
    try {
      localStorage.setItem(`lead:${id}`, JSON.stringify({ ts: Date.now() }));
    } catch {
      /* no-op */
    }
    setInterested(true);
    setShowForm(false);
  };

  // Now it’s safe to branch on invalid data AFTER all hooks
  if (!id) {
    return (
      <div className="p-4 border rounded">
        <p className="text-gray-500">Invalid property data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Card */}
      <Link
        href={`/properties/${id}`}
        className="block rounded-2xl border hover:shadow-md transition"
      >
        <div className="aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {property?.hero_url ? (
            <img
              src={property.hero_url}
              alt={property?.title || 'Property image'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">{property?.title || 'Untitled'}</h2>
          <p className="text-sm text-gray-500">
            {property?.city}, {property?.state}
          </p>
          <p className={`text-xs text-gray-400 mt-1 ${verificationClass}`}>
            Status: {verificationLabel}
          </p>
        </div>
      </Link>

      {/* Interest */}
      <div className="px-4">
        {interested ? (
          <div className="mt-2 rounded-2xl border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-800">
            Interest recorded — we’ll contact you soon.
          </div>
        ) : !showForm ? (
          <button
            className="mt-2 w-full rounded border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setShowForm(true)}
            aria-label={`I'm interested in ${property?.title ?? 'property'}`}
          >
            I’m interested
          </button>
        ) : (
          <div className="mt-2 rounded-2xl border px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">I’m interested</div>
              <button
                className="text-xs text-gray-500 hover:underline"
                onClick={() => setShowForm(false)}
              >
                Close
              </button>
            </div>
            <InterestForm
              propertyId={id}
              propertyTitle={property?.title}
              onSuccess={handleInterestSuccess}
            />
          </div>
        )}
      </div>

      {/* Share */}
      <div className="px-4 pb-3">
        <ShareButtons
          id={id}
          title={property?.title}
          city={property?.city}
          state={property?.state}
        />
      </div>
    </div>
  );
}
