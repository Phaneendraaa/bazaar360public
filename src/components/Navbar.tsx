'use client';

import Link from 'next/link';
import { Phone, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Tagline */}
            <div className="flex items-center gap-4">
              <Link href="/" className="group flex items-center shrink-0">
                <img
                  src="/logo.png"
                  alt="Bazaar360 Logo"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </Link>
              
              {/* Divider */}
              <div className="hidden h-7 w-px bg-slate-200 sm:block"></div>
              
              {/* Tagline */}
              <span className="hidden text-xs font-semibold tracking-wide text-slate-400 sm:block">
                Quality Products Delivered to Your Doorstep
              </span>
            </div>

          {/* Quick Contacts & Admin */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="https://wa.me/919063454476"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Phone className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-current" />
              <span>WhatsApp Support</span>
            </a>

            <Link
              href="/admin"
              className="flex items-center gap-1 rounded-full border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 sm:px-3 sm:py-1.5 sm:text-sm"
              title="Admin Portal"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
