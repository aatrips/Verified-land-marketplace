// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Buyers Choice Realty',
  description: 'Authentic land deals with end-to-end paperwork handled.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <Providers>
          <NavBar />
          <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
