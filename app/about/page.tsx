'use client';

import { useI18n } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">{t('about.title')}</h1>

      <p className="text-sm text-gray-700 mb-3">{t('about.p1')}</p>
      <p className="text-sm text-gray-700 mb-3">{t('about.p2')}</p>
      <p className="text-sm text-gray-700 mb-6">{t('about.p3')}</p>

      <div className="rounded-xl border p-4 bg-white">
        <div className="font-medium mb-2">{t('about.list.title')}</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>{t('about.list.trust')}</li>
          <li>{t('about.list.end2end')}</li>
          <li>{t('about.list.aftercare')}</li>
        </ul>
      </div>
    </main>
  );
}
