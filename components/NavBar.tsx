'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthReady } from '@/lib/auth-ready';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

function AdminControls() {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <>
      <Link href="/ops/leads" className="hover:underline">Admin</Link>
      <button onClick={signOut} className="hover:underline">Logout</button>
    </>
  ) : (
    <Link href="/login?next=/ops/leads" className="hover:underline">Admin Login</Link>
  );
}

export default function NavBar() {
  const authReady = useAuthReady();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Buyers Choice Realty — Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Buyers Choice Realty" className="h-12 w-auto sm:h-14 lg:h-16" />
          <span className="hidden md:inline text-xl font-semibold tracking-tight">
            Buyers Choice Realty
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/properties" className="hover:underline">Browse</Link>
          <Link href="/seller" className="hover:underline">List property</Link>
          <Link href="/about" className="hover:underline">About</Link>

          {authReady ? (
            <AdminControls />
          ) : (
            <Link href="/login?next=/ops/leads" className="hover:underline">Admin Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
