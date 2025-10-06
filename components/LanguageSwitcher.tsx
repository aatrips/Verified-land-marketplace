'use client';

import { useI18n } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed top-3 right-3 z-50">
      <div className="rounded-xl border bg-white/90 backdrop-blur px-2 py-1 shadow-sm">
        <button
          className={`px-2 py-1 text-sm rounded ${lang === 'en' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setLang('en')}
        >
          EN
        </button>
        <button
          className={`ml-1 px-2 py-1 text-sm rounded ${lang === 'hi' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setLang('hi')}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
}
