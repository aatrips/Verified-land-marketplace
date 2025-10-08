'use client';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export function initSupabaseBrowserClient(url: string, anon: string) {
  return createBrowserSupabaseClient({
    supabaseUrl: url,
    supabaseKey: anon,
  });
}
