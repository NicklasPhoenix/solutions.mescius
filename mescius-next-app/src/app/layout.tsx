// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header'; // Import our new Header

export const metadata: Metadata = {
  title: 'Mescius - Modern Solutions',
  description: 'The new Mescius website.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* Our header will now appear on every page */}
        {children}
        {/* Our footer will go here later */}
      </body>
    </html>
  );
}