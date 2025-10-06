'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import InterestForm from '@/components/InterestForm';
import ShareButtons from '@/components/ShareButtons';
import { useI18n } from '@/lib/i18n';

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
  const { t } = useI18n();

  // Hooks first
  const [showForm, setShowForm] = useState(false);
  const [interested, setInterested] = useState(false);

  const id = property?.id ?? null;

  useEffect(() => {
    if (!id) return;
    try {
      const v = localStorage.getItem(`lead:${id}`);
      setInterested(!!v);
    } catch {}
  }, [id]);

  const verificationLabel =
    typeof property?.verification === 'boolean'
      ? property?.verification
        ? t('status.VERIFIED')
        : t('status.PENDING')
      : property?.status || t('status.Pending');

  const verificationClass =
    verificationLabel === t('status.VERIFIED')
      ? 'text-green-600'
      : verificationLabel === t('status.PENDING') || verificationLabel === t('status.Pending')
      ? 'text-yellow-600'
      : 'text-gray-400';

  const handleInterestSuccess = () => {
    if (!id) return;
    try {
      localStorage.setItem(`lead:${id}`, JSON.stringify({ ts: Date.now() }));
    } catch {}
    setInterested(true);
    setShowForm(false);
  };

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
              alt={property?.title || t('card.untitled')}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              {t('card.noImage')}
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">{property?.title || t('card.untitled')}</h2>
          <p className="text-sm text-gray-500">
            {property?.city}, {property?.state}
          </p>
          <p className={`text-xs text-gray-400 mt-1 ${verificationClass}`}>
            {t('label.status')}: {verificationLabel}
          </p>
        </div>
      </Link>

      {/* Interest */}
      <div className="px-4">
        {interested ? (
          <div className="mt-2 rounded-2xl border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-800">
            {t('message.interestRecorded')}
          </div>
        ) : !showForm ? (
          <button
            className="mt-2 w-full rounded border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setShowForm(true)}
            aria-label={`${t('cta.interested')} — ${property?.title ?? ''}`}
          >
            {t('cta.interested')}
          </button>
        ) : (
          <div className="mt-2 rounded-2xl border px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">{t('cta.interested')}</div>
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
