"use client";

import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo + brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg" // place your logo file inside /public
            alt="BuyersChoice"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold">BuyersChoice</span>
        </Link>

        {/* Main navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/properties" className="hover:text-gray-700">
            Browse
          </Link>
          <Link
            href="/seller"
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Sell
          </Link>
          <Link href="/ops" className="hover:text-gray-700">
            Ops
          </Link>
        </div>

        {/* Auth placeholder (replace with Supabase auth state later) */}
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
