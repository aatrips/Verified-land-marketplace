'use client';

import { useEffect, useRef, useState } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthReady } from '../../lib/auth-ready';
import { initSupabaseBrowserClient } from '../../lib/supabase-browser';

export default function LoginPage() {
  const authReady = useAuthReady();
  const supabase = useSupabaseClient<any>(); // may be undefined until Providers init
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') || '/ops/leads';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // cache an ephemeral client if we need to create one on-demand
  const localClientRef = useRef<any | null>(null);

  useEffect(() => {
    if (authReady && session) router.replace(next);
  }, [authReady, session, next, router]);

  async function getActiveClient() {
    // Prefer global client if ready
    if (authReady && supabase) return supabase;

    // Otherwise lazily create a local client once
    if (!localClientRef.current) {
      // try build-time env first
      let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      let anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (!url || !anon) {
        const res = await fetch('/api/public-env', { cache: 'no-store' });
        const j = await res.json();
        url = j?.url || '';
        anon = j?.anon || '';
      }
      if (!url || !anon) throw new Error('Auth configuration missing');

      localClientRef.current = initSupabaseBrowserClient(url, anon);
    }
    return localClientRef.current;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const client = await getActiveClient();

      if (mode === 'signin') {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await client.auth.signUp({ email, password });
        if (error) throw error;
      }
      // session effect will redirect when available
    } catch (e: any) {
      setErr(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === 'signin' ? 'Admin Login' : 'Create Admin'}
      </h1>

      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border p-4">
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>

        {err && <div className="text-sm text-red-700">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>

        <div className="text-sm text-gray-600">
          {mode === 'signin' ? (
            <>
              Don’t have an account?{' '}
              <button type="button" className="underline" onClick={() => setMode('signup')}>
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="underline" onClick={() => setMode('signin')}>
                Sign in
              </button>
            </>
          )}
        </div>
      </form>
    </main>
  );
}
