// components/PropertyCard.tsx
'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export type PropertyRow = {
  id?: string;
  title?: string;
  city?: string;
  state?: string;
  hero_url?: string;
  status?: string;      // 'VERIFIED' | 'PENDING'
  created_at?: string;
};

export default function PropertyCard({ property }: { property: PropertyRow }) {
  const { t } = useI18n();

  if (!property || !property.id) {
    return (
      <div className="p-4 border rounded">
        <p className="text-gray-500">{t('card.invalid')}</p>
      </div>
    );
  }

  const isVerified = (property.status ?? '').toUpperCase() === 'VERIFIED';

  return (
    <Link href={`/properties/${property.id}`} className="block rounded-2xl border hover:shadow-md transition">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {property.hero_url ? (
          <img
            src={property.hero_url}
            alt={property.title || t('card.untitled')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            {t('card.noImage')}
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{property.title || t('card.untitled')}</h2>
        <p className="text-sm text-gray-500">
          {property.city}, {property.state}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {t('card.status')}{' '}
          {isVerified ? t('status.verified') : t('status.pending')}
        </p>
      </div>
    </Link>
  );
}
