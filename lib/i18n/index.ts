// lib/i18n/index.ts
'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Lang = 'en' | 'hi';
type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = {
  en: {
    // Nav
    'nav.browse': 'Browse',
    'nav.listProperty': 'List property',
    'nav.about': 'About',
    'nav.ops': 'Ops',
    'nav.lang.en': 'EN',
    'nav.lang.hi': 'हिंदी',

    // Home
    'home.headline': 'Land deals you can',
    'home.headline.trust': 'trust',
    'home.lede':
      'BuyersChoice verifies documents and handles paperwork end-to-end so you can buy land with confidence.',
    'home.cta.browse': 'Browse verified listings',
    'home.cta.list': 'List your property',
    'home.value.verification.t': 'Verification',
    'home.value.verification.d': 'Background checks and paperwork validation by our ops team',
    'home.value.transparency.t': 'Transparency',
    'home.value.transparency.d': 'Clear status and updates for every listed property',
    'home.value.assistance.t': 'End-to-End Assistance',
    'home.value.assistance.d': 'From site visit to registration—handled with care',
    'home.latest': 'Latest Properties',
    'home.loading': 'Loading…',
    'home.empty': 'No properties yet.',

    // Card
    'card.invalid': 'Invalid property data',
    'card.noImage': 'No image',
    'card.untitled': 'Untitled',
    'card.status': 'Status:',
    'status.verified': 'Verified',
    'status.pending': 'Pending',
  },

  hi: {
    // Nav
    'nav.browse': 'लिस्टिंग',
    'nav.listProperty': 'प्रॉपर्टी सूचीबद्ध करें',
    'nav.about': 'हमारे बारे में',
    'nav.ops': 'ऑप्स',
    'nav.lang.en': 'EN',
    'nav.lang.hi': 'हिंदी',

    // Home
    'home.headline': 'ऐसे भूखंड सौदे जिन पर आप',
    'home.headline.trust': 'भरोसा',
    'home.lede':
      'BuyersChoice दस्तावेज़ों का सत्यापन करता है और पूरी कागजी प्रक्रिया संभालता है ताकि आप निश्चिंत होकर ज़मीन खरीद सकें।',
    'home.cta.browse': 'वेरिफ़ाइड लिस्टिंग देखें',
    'home.cta.list': 'अपनी प्रॉपर्टी सूचीबद्ध करें',
    'home.value.verification.t': 'वेरिफ़िकेशन',
    'home.value.verification.d': 'हमारी ऑप्स टीम द्वारा बैकग्राउंड चेक और दस्तावेज़ सत्यापन',
    'home.value.transparency.t': 'पारदर्शिता',
    'home.value.transparency.d': 'हर लिस्टिंग की स्थिति और अपडेट स्पष्ट रूप से',
    'home.value.assistance.t': 'पूरी प्रक्रिया में सहायता',
    'home.value.assistance.d': 'साइट विज़िट से रजिस्ट्रेशन तक—पूरी मदद',
    'home.latest': 'नवीनतम लिस्टिंग',
    'home.loading': 'लोड हो रहा है…',
    'home.empty': 'अभी कोई लिस्टिंग नहीं है।',

    // Card
    'card.invalid': 'अमान्य प्रॉपर्टी डेटा',
    'card.noImage': 'कोई तस्वीर नहीं',
    'card.untitled': 'शीर्षक रहित',
    'card.status': 'स्थिति:',
    'status.verified': 'सत्यापित',
    'status.pending': 'लंबित',
  },
};

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const warned = useRef<Set<string>>(new Set());

  // Hydrate language from localStorage or browser preference
  useEffect(() => {
    try {
      const saved = (localStorage.getItem('lang') || '').trim() as Lang;
      if (saved === 'en' || saved === 'hi') {
        setLang(saved);
        return;
      }
      const prefersHi =
        typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('hi');
      setLang(prefersHi ? 'hi' : 'en');
    } catch {
      setLang('en');
    }
  }, []);

  const t = useMemo(() => {
    return (key: string) => {
      const dict = DICTS[lang];
      if (dict && key in dict) return dict[key];
      if (DICTS.en && key in DICTS.en) return DICTS.en[key];
      // Dev aid: warn once if a key is missing
      if (process.env.NODE_ENV !== 'production' && !warned.current.has(key)) {
        warned.current.add(key);
        // eslint-disable-next-line no-console
        console.warn(`[i18n] Missing key: ${key}`);
      }
      return key;
    };
  }, [lang]);

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      setLang: (l: Lang) => {
        setLang(l);
        try {
          localStorage.setItem('lang', l);
        } catch {}
      },
      t,
    }),
    [lang, t]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
