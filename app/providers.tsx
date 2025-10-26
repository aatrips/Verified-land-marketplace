// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes'; // optional if you use dark/light theme
import { SessionProvider } from 'next-auth/react'; // optional if you use auth
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
