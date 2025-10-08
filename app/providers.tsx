'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { initSupabaseBrowserClient } from '../lib/supabase-browser';
import { I18nProvider } from '../lib/i18n';
import { AuthReadyContext } from '../lib/auth-ready';

export default function Providers({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<any | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && anon) {
      setClient(initSupabaseBrowserClient(url, anon));
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/public-env', { cache: 'no-store' });
        const j = await res.json();
        if (j?.url && j?.anon) setClient(initSupabaseBrowserClient(j.url, j.anon));
      } catch (e) {
        console.error('Failed to load public envs:', e);
      }
    })();
  }, []);

  return (
    <AuthReadyContext.Provider value={!!client}>
      {client ? (
        <SessionContextProvider supabaseClient={client}>
          <I18nProvider>{children}</I18nProvider>
        </SessionContextProvider>
      ) : (
        <I18nProvider>{children}</I18nProvider>
      )}
    </AuthReadyContext.Provider>
  );
}
