// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Use Vercel envs when present; fall back to hardcoded dev values so StackBlitz/ephemeral envs don't crash
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://mehpjxoheirtktriokon.supabase.co​';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1laHBqeG9oZWlydGt0cmlva29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzA2NzgsImV4cCI6MjA3NDcwNjY3OH0.3cFNnsnE12WE8Xhi6qyrieN04yiYKB7UhJYtpmZaq4o';

// Create a single shared client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Backward-compat shim so old code still works without edits
export const getSupabaseClient = () => supabase;
