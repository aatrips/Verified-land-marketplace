// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let singleton: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (singleton) return singleton;

  // Read public keys from window.__env (StackBlitz-friendly)
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient() must be called in the browser (client components).');
  }
  const w = window as unknown as { __env?: Record<string, string> };
  const url = w.__env?.NEXT_PUBLIC_SUPABASE_URL;
  const anon = w.__env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('Public Supabase env missing. Ensure public/env.js is loaded in layout <head>.');
  }

  singleton = createClient(url, anon);
  return singleton;
}
