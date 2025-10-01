'use client';

import Link from 'next/link';

export type PropertyRow = {
  id?: string;
  title?: string;
  city?: string;
  state?: string;
  hero_url?: string;
  status?: string;
  created_at?: string;
};

export default function PropertyCard({ property }: { property: PropertyRow }) {
  if (!property || !property.id) {
    return (
      <div className="p-4 border rounded">
        <p className="text-gray-500">Invalid property data</p>
      </div>
    );
  }

  return (
    <Link
      href={`/properties/${property.id}`}
      className="block rounded-2xl border hover:shadow-md transition"
    >
      <div className="aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {property.hero_url ? (
          <img
            src={property.hero_url}
            alt={property.title || 'Property image'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{property.title || 'Untitled'}</h2>
        <p className="text-sm text-gray-500">
          {property.city}, {property.state}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Status: {property.status || 'Pending'}
        </p>
      </div>
    </Link>
  );
}
