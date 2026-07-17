import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ThemeToggle } from '@/components/theme-toggle';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WordPress API Explorer',
  description: 'Explore and visualize WordPress API endpoints',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="py-6 border-t">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    WordPress API Explorer
                  </p>
                  <ThemeToggle />
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}