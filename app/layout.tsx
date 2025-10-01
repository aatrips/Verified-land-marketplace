// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'BuyersChoice',
  description: 'Verified land marketplace',
};

// It's fine to omit the explicit Viewport type if your Next types don't export it
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* If you previously used beforeInteractive, switch to afterInteractive in App Router */}
        {/* <Script src="/your-script.js" strategy="afterInteractive" /> */}
      </head>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
