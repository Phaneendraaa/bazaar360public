'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, PhoneCall, Clock, MessageCircle, MapPin, CheckCircle, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;

    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormName('');
      setFormEmail('');
      setFormMsg('');
    }, 1000);
  };

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'It is simple and safe! You browse products, place your order using shipping details, and pay cash directly to the courier executive only when the package is handed over to you. No advance payment is required.',
    },
    {
      q: 'Are there any shipping charges?',
      a: 'No, shipping is 100% Free on all orders sitewide. No minimum purchase is required.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is confirmed and shipped, our delivery team will send updates on your registered phone number. You will receive dispatch SMS notifications with a tracking link.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 7-day hassle-free return policy. If you receive a damaged or incorrect product, contact us on WhatsApp or email within 7 days, and we will arrange a free reverse pickup and full refund.',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-slate-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Contact Us</h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
              Have questions about your order, return requests, or custom products? Reach out via WhatsApp, phone, email, or use the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 mb-16">
            {/* Left Column: Contact Card Details */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Direct Support</h3>

              <div className="space-y-4">
                <a
                  href="https://wa.me/919063454476"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-emerald-100 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 hover:scale-101 transition-all"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800">WhatsApp Chat</h5>
                    <p className="text-sm font-semibold mt-0.5">+91 90634 54476 (Naga Phaneendra)</p>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                  <PhoneCall className="h-5 w-5 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">Phone Support</h5>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">+91 90634 54476</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">Email Support</h5>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">support@sutastitch.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">Business Hours</h5>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">Mon - Sat: 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Contact Form */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Send Us a Message</h3>

              {submitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 text-center text-emerald-800 space-y-3">
                  <CheckCircle className="h-10 w-10 mx-auto text-emerald-600" />
                  <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-600 max-w-sm mx-auto">
                    Thank you for reaching out. A support coordinator will respond to your query on email/phone within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. jane@domain.com"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Message</label>
                    <textarea
                      rows={5}
                      required
                      value={formMsg}
                      onChange={(e) => setFormMsg(e.target.value)}
                      placeholder="Write your question, feedback, or refund inquiry here..."
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow hover:bg-blue-700 disabled:bg-slate-200 cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Section: Google Map & FAQ */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            
            {/* Google Map Mockup */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Our Head Office</h3>
              <div className="relative h-64 rounded-xl border border-slate-150 overflow-hidden bg-slate-50 flex items-center justify-center text-center p-6">
                
                {/* Background Map Graphic Mockup */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-slate-200"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2 max-w-xs">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 shadow border border-red-150">
                    <MapPin className="h-5 w-5 animate-bounce" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Suta & Stitch Logistics Hub</h4>
                  <p className="text-xs text-slate-400">
                    4th Floor, Innovation Hub Building, Sector 62, Noida, Uttar Pradesh, 201301
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Panel */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="space-y-1.5 text-sm">
                    <h5 className="font-bold text-slate-800">Q: {faq.q}</h5>
                    <p className="text-slate-500 leading-relaxed text-xs">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
