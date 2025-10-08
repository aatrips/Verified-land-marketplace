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
    // CTA / messages
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
    // About page
    'about.title': 'About Buyers Choice Realty',
    'about.p1': 'We bring authentic, verified land deals—no surprises.',
    'about.p2': 'Our operations team validates documents, titles, and ownership before a listing goes live.',
    'about.p3': 'We manage the paperwork end-to-end and support you even after purchase.',
    'about.list.title': 'What we do',
    'about.list.trust': 'Authentic deals backed by verification',
    'about.list.end2end': 'End-to-end paperwork and registration',
    'about.list.aftercare': 'Post-purchase help (mutation, utilities, etc.)',
  },

  hi: {
    // Generic
    'label.status': 'स्थिति',
    'card.noImage': 'कोई छवि नहीं',
    'card.untitled': 'शीर्षक रहित',
    // CTA / messages
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
    // About page
    'about.title': 'बायर्स चॉइस रियल्टी के बारे में',
    'about.p1': 'हम सत्यापित और भरोसेमंद भूमि सौदे लाते हैं—बिना किसी छिपी बात के।',
    'about.p2': 'लिस्टिंग लाइव होने से पहले हमारी ऑप्स टीम दस्तावेज़, टाइटल और मालिकाना हक की जाँच करती है।',
    'about.p3': 'हम पूरा कागज़ी काम एंड-टू-एंड संभालते हैं और खरीद के बाद भी सहायता करते हैं।',
    'about.list.title': 'हम क्या करते हैं',
    'about.list.trust': 'सत्यापन से समर्थित प्रामाणिक डील्स',
    'about.list.end2end': 'एंड-टू-एंड कागज़ी काम और रजिस्ट्रेशन',
    'about.list.aftercare': 'खरीद के बाद सहायता (म्युटेशन, यूटिलिटीज़ आदि)',
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

  // Load saved language once after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved === 'en' || saved === 'hi') setLangState(saved);
    } catch {
      /* noop */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* noop */
    }
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
