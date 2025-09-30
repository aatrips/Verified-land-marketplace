// utils/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}
