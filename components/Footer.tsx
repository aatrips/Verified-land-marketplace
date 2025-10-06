'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-medium text-gray-800">Buyers Choice Realty</div>
          <div className="text-xs text-gray-500">© {new Date().getFullYear()} Buyers Choice Realty</div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/properties" className="hover:underline">Browse</Link>
          <Link href="/seller" className="hover:underline">List property</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
