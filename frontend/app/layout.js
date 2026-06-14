import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: {
    default: 'REVORAFIT — Recover • Rehab • Perform',
    template: '%s | REVORAFIT',
  },
  description:
    'Premium fitness equipment, physiotherapy tools & medical recovery products. Shop REVORAFIT — the ultimate D2C brand for athletes and rehabilitation.',
  keywords: ['fitness equipment', 'physiotherapy', 'medical equipment', 'rehabilitation', 'resistance bands', 'TENS machine', 'knee support'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'REVORAFIT',
    title: 'REVORAFIT — Recover • Rehab • Perform',
    description: 'Premium fitness, physiotherapy & medical equipment. Shop now.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: { primary: '#7ED957', secondary: '#000' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
