import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Smart Parking Monitoring System',
    template: '%s | Smart Parking',
  },
  description:
    'AI-powered campus parking monitoring system with Face Recognition, License Plate OCR, and YOLOv8 violation detection.',
  keywords: ['parking', 'monitoring', 'campus', 'AI', 'face recognition', 'YOLO'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
