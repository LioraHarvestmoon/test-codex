import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Brand Intelligence Explorer',
  description: 'Search and synthesize brand insights from multiple providers.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
