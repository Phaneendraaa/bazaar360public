import Link from 'next/link';
import { Mail, PhoneCall, Clock, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-4">
            <img
              src="/logo.png"
              alt="Suta & Stitch Logo"
              className="h-10 w-auto object-contain self-start"
            />
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              We curate and craft premium women's wear, combining traditional Indian heritage with modern western aesthetics, delivered directly to you with love.
            </p>
          </div>

          {/* Policy Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              Policies & Info
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              <li>
                <Link href="/policy/privacy-policy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policy/terms-conditions" className="hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policy/shipping-policy" className="hover:text-blue-600 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policy/refund-policy" className="hover:text-blue-600 transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Us / FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              Customer Support
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-blue-600" />
                <a href="tel:+919063454476" className="hover:text-blue-600">+91 90634 54476</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <a href="mailto:support@sutastitch.com" className="hover:text-blue-600">support@sutastitch.com</a>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex gap-2">
                <a
                  href="https://wa.me/919063454476"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <MessageCircle className="h-3.5 w-3.5 fill-current" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} Suta & Stitch. All rights reserved.</p>
          <p className="flex gap-4">
            <span>Verified SSL Secure</span>
            <span>COD Available</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
