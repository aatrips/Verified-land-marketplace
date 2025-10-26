'use client';
import { useState } from 'react';

type Lang = 'en' | 'hi';

export function useI18n() {
  const [lang, setLang] = useState<Lang>('en');

  const translations: Record<Lang, Record<string, string>> = {
    en: {
      // Navbar
      'nav.browse': 'Browse Properties',
      'nav.listProperty': 'List Property',
      'nav.about': 'About',
      'nav.ops': 'More Options',
      'nav.lang.hi': 'हिन्दी',
      'nav.lang.en': 'English',

      // Home Page
      'home.headline': 'Find Verified Lands',
      'home.headline.trust': 'Trusted. Transparent. True Value.',
      'home.lede': 'Buy and sell verified properties across India.',
      'home.cta.browse': 'Browse Now',
      'home.cta.list': 'List Your Property',
      'home.latest': 'Latest Verified Listings',
      'home.empty': 'No properties found at the moment.',
      'home.loading': 'Loading...',

      // Values
      'home.value.verification.t': 'Verified Documents',
      'home.value.verification.d': 'We verify every property’s legal papers.',
      'home.value.transparency.t': 'Transparent Pricing',
      'home.value.transparency.d': 'Know the market price and fair deals.',
      'home.value.assistance.t': 'Buyer Assistance',
      'home.value.assistance.d': 'Our experts assist you at every step.',

      // About Page (added)
      'about.title': 'About BuyersChoice',
      'about.p1': 'We’re building India’s most trusted marketplace for land.',
      'about.p2': 'Every listing passes through standard checks for peace of mind.',
      'about.p3': 'From shortlisting to registration, we support you throughout.',
      'about.list.title': 'What makes us different',
      'about.list.trust': 'Document-first trust layer',
      'about.list.end2end': 'End-to-end support',
      'about.list.aftercare': 'After-sales assistance',

      // Common
      'common.loading': 'Loading...',
    },

    hi: {
      // Navbar
      'nav.browse': 'संपत्तियाँ देखें',
      'nav.listProperty': 'संपत्ति जोड़ें',
      'nav.about': 'हमारे बारे में',
      'nav.ops': 'अधिक विकल्प',
      'nav.lang.hi': 'हिन्दी',
      'nav.lang.en': 'अंग्रेज़ी',

      // Home Page
      'home.headline': 'प्रमाणित भूमि खोजें',
      'home.headline.trust': 'विश्वसनीय. पारदर्शी. सही मूल्य.',
      'home.lede': 'भारत भर में सत्यापित संपत्तियाँ खरीदें और बेचें।',
      'home.cta.browse': 'अभी देखें',
      'home.cta.list': 'अपनी संपत्ति सूचीबद्ध करें',
      'home.latest': 'नवीनतम प्रमाणित सूचियाँ',
      'home.empty': 'अभी कोई संपत्ति उपलब्ध नहीं है।',
      'home.loading': 'लोड हो रहा है...',

      // Values
      'home.value.verification.t': 'प्रमाणित दस्तावेज़',
      'home.value.verification.d': 'हम हर संपत्ति के कानूनी दस्तावेज़ सत्यापित करते हैं।',
      'home.value.transparency.t': 'पारदर्शी मूल्य निर्धारण',
      'home.value.transparency.d': 'बाजार मूल्य और निष्पक्ष सौदे जानें।',
      'home.value.assistance.t': 'खरीदार सहायता',
      'home.value.assistance.d': 'हमारे विशेषज्ञ हर कदम पर आपकी मदद करते हैं।',

      // About Page (added)
      'about.title': 'बायर्सचॉइस के बारे में',
      'about.p1': 'हम भारत का सबसे भरोसेमंद भूमि मार्केटप्लेस बना रहे हैं।',
      'about.p2': 'हर लिस्टिंग शांति-ए-मन के लिए मानक जांचों से गुजरती है।',
      'about.p3': 'शॉर्टलिस्टिंग से रजिस्ट्रेशन तक, हम आपके साथ हैं।',
      'about.list.title': 'हमें अलग क्या बनाता है',
      'about.list.trust': 'दस्तावेज़-प्रथम भरोसा परत',
      'about.list.end2end': 'एंड-टू-एंड सपोर्ट',
      'about.list.aftercare': 'बिक्री के बाद सहायता',

      // Common
      'common.loading': 'लोड हो रहा है...',
    },
  };

  const t = (key: string) => translations[lang]?.[key] ?? key;

  // Backward-compatible return; also provide a `locale` alias if you ever need it.
  return { lang, setLang, t, locale: lang as string };
}
