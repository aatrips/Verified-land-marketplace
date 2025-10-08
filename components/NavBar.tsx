// components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function NavBar() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Buyers Choice Realty — Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Buyers Choice Realty"
            className="h-12 w-auto sm:h-14 lg:h-16"
          />
          <span className="hidden md:inline text-xl font-semibold tracking-tight">
            Buyers Choice Realty
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/properties" className="hover:underline">{t('nav.browse')}</Link>
          <Link href="/seller" className="hover:underline">{t('nav.listProperty')}</Link>
          <Link href="/about" className="hover:underline">{t('nav.about')}</Link>
          <Link href="/ops/leads" className="hover:underline">{t('nav.ops')}</Link>

          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="ml-2 rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
            aria-label="Toggle language"
            title="Toggle language"
          >
            {lang === 'en' ? t('nav.lang.hi') : t('nav.lang.en')}
          </button>
        </nav>
      </div>
    </header>
  );
}
