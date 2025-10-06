// app/layout.tsx
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Buyers Choice Realty',
  description: 'Where Trust Meets Property',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Buyers Choice Realty',
    description: 'Where Trust Meets Property',
    url: siteUrl,
    siteName: 'Buyers Choice Realty',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buyers Choice Realty',
    description: 'Where Trust Meets Property',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
