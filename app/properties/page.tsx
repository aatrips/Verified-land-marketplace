// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,city,state,hero_url,created_at,verification')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
      } else {
        const rows = (data ?? []).map((p: any) => ({
          id: p.id,
          title: p.title,
          city: p.city,
          state: p.state,
          hero_url: p.hero_url,
          created_at: p.created_at,
          status: p.verification ? 'VERIFIED' : 'PENDING',
        })) as PropertyRow[];
        setProperties(rows);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-50 border-b">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-4xl font-bold">
            {t('home.headline')} <span className="text-green-700">{t('home.headline.trust')}</span>.
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            {t('home.lede')}
          </p>
          <div className="mt-6 flex gap-3">
            {/* FIX: route to the actual browse page */}
            <Link
              href="/browse"
              className="rounded bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              {t('home.cta.browse')}
            </Link>
            <Link
              href="/seller"
              className="rounded border px-5 py-2 hover:bg-gray-100"
            >
              {t('home.cta.list')}
            </Link>
          </div>

          {/* Value Props */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { tkey: 'home.value.verification.t', dkey: 'home.value.verification.d' },
              { tkey: 'home.value.transparency.t', dkey: 'home.value.transparency.d' },
              { tkey: 'home.value.assistance.t', dkey: 'home.value.assistance.d' },
            ].map(({ tkey, dkey }) => (
              <div key={tkey} className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="text-lg font-semibold">{t(tkey)}</div>
                <div className="mt-2 text-gray-600 text-sm">{t(dkey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Properties */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">{t('home.latest')}</h2>
        {loading ? (
          <p>{t('home.loading')}</p>
        ) : properties.length === 0 ? (
          <p>{t('home.empty')}</p>
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
