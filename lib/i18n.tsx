'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'hi';

type Dict = Record<string, string>;
type Dictionaries = Record<Lang, Dict>;

const dictionaries: Dictionaries = {
  en: {
    // Generic
    'label.status': 'Status',
    'card.noImage': 'No image',
    'card.untitled': 'Untitled',
    // CTA
    'cta.interested': 'I’m interested',
    'message.interestRecorded': 'Interest recorded — we’ll contact you soon.',
    // Home hero
    'home.hero.title.prefix': 'Land deals you can',
    'home.hero.title.em': 'trust',
    'home.hero.subtitle':
      'BuyersChoice verifies documents and handles paperwork end-to-end so you can buy land with confidence.',
    'home.cta.browse': 'Browse verified listings',
    'home.cta.list': 'List your property',
    'home.value.verify.t': 'Verification',
    'home.value.verify.d': 'Background checks and paperwork validation by our ops team',
    'home.value.transp.t': 'Transparency',
    'home.value.transp.d': 'Clear status and updates for every listed property',
    'home.value.assist.t': 'End-to-End Assistance',
    'home.value.assist.d': 'From site visit to registration—handled with care',
    // Verification states
    'status.VERIFIED': 'VERIFIED',
    'status.PENDING': 'PENDING',
    'status.Pending': 'Pending',
  },
  hi: {
    // Generic
    'label.status': 'स्थिति',
    'card.noImage': 'कोई छवि नहीं',
    'card.untitled': 'शीर्षक रहित',
    // CTA
    'cta.interested': 'मुझे रुचि है',
    'message.interestRecorded': 'रुचि दर्ज हो गई — हम जल्द ही आपसे संपर्क करेंगे।',
    // Home hero
    'home.hero.title.prefix': 'ऐसे भूमि सौदे जिन पर आप',
    'home.hero.title.em': 'भरोसा कर सकते हैं',
    'home.hero.subtitle':
      'BuyersChoice दस्तावेज़ सत्यापित करता है और संपूर्ण कागज़ी कार्य संभालता है ताकि आप भरोसे के साथ जमीन खरीद सकें।',
    'home.cta.browse': 'सत्यापित लिस्टिंग देखें',
    'home.cta.list': 'अपनी संपत्ति सूचीबद्ध करें',
    'home.value.verify.t': 'सत्यापन',
    'home.value.verify.d': 'हमारी ऑप्स टीम द्वारा बैकग्राउंड चेक और दस्तावेज़ जांच',
    'home.value.transp.t': 'पारदर्शिता',
    'home.value.transp.d': 'हर संपत्ति के लिए स्पष्ट स्थिति और अपडेट',
    'home.value.assist.t': 'एंड-टू-एंड सहायता',
    'home.value.assist.d': 'साइट विज़िट से लेकर रजिस्ट्रेशन तक — सब कुछ हम संभालते हैं',
    // Verification states
    'status.VERIFIED': 'सत्यापित',
    'status.PENDING': 'लंबित',
    'status.Pending': 'लंबित',
  },
};

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved === 'en' || saved === 'hi') setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  };

  const t = useMemo(() => {
    return (key: string, fallback?: string) => {
      const dict = dictionaries[lang] || dictionaries.en;
      return dict[key] ?? fallback ?? key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
