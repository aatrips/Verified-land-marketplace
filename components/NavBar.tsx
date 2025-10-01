// components/NavBar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Browse' },
  { href: '/seller', label: 'Sell' },
  { href: '/ops', label: 'Ops' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-semibold">TrueAcre</Link>
        <ul className="flex items-center gap-4 text-sm">
          {links.map(l => {
            const active = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-2 py-1 rounded-md ${active ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
