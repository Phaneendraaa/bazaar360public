import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Bazaar360 | Quality Products Delivered to Your Doorstep',
  description: 'Shop premium, quality products at Bazaar360 with Fast Shipping and Cash on Delivery (COD) available. Simple, secure, and hassle-free ordering.',
  keywords: ['Bazaar360', 'E-commerce', 'Cash on Delivery', 'Fast Shipping', 'Dropshipping'],
  openGraph: {
    title: 'Bazaar360 | Quality Products Delivered to Your Doorstep',
    description: 'Shop premium quality products at Bazaar360. Secure checkout and Cash on Delivery (COD) available.',
    type: 'website',
    url: 'https://bazaar360.com',
    siteName: 'Bazaar360',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        {children}
      </body>
    </html>
  );
}
