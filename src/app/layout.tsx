import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Suta & Stitch | Premium Women\'s Fashion & Accessories',
  description: 'Discover colorful, hand-crafted Indian wear, Western wear, and designer accessories at Suta & Stitch. Fast shipping and Cash on Delivery (COD) available.',
  keywords: ['Suta & Stitch', 'Suta and Stitch', 'Womens Fashion', 'Indian Wear', 'Western Wear', 'Accessories', 'Saree', 'Anarkali', 'Cash on Delivery'],
  openGraph: {
    title: 'Suta & Stitch | Premium Women\'s Fashion & Accessories',
    description: 'Shop colorful, premium women\'s fashion and accessories at Suta & Stitch. Cash on Delivery (COD) and free shipping available.',
    type: 'website',
    url: 'https://sutastitch.com',
    siteName: 'Suta & Stitch',
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
    <html lang="en" className={`${outfit.variable} ${playfair.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        {children}
      </body>
    </html>
  );
}
