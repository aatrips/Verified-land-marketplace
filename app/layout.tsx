// app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Sree Ram Reality',
  description: 'Property listings',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Load public env BEFORE any client code runs */}
        <Script src="/env.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen bg-white text-gray-900">
        <NavBar />
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
