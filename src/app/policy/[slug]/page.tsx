'use client';

import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ShieldAlert, FileText, Truck, RotateCcw } from 'lucide-react';

const policies: Record<string, { title: string; icon: any; content: string[] }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    icon: ShieldAlert,
    content: [
      'At Bazaar360, accessible from bazaar360.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Bazaar360 and how we use it.',
      'We do not collect credit card details or bank account information since all transactions on Bazaar360 are processed via Cash on Delivery (COD). We only collect basic shipping information (Full Name, Address, Phone Numbers) to fulfill your orders.',
      'We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.',
      'Your phone number may be shared with our delivery partners (such as Delhivery, Blue Dart, or FedEx) to coordinate delivery notifications and updates.',
      'We retain your shipping details in our database to manage orders, process cancellations/refunds, and identify return abuse. If you wish to have your shipping details deleted from our database, please contact support@bazaar360.com.'
    ],
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    icon: FileText,
    content: [
      'These terms and conditions outline the rules and regulations for the use of Bazaar360\'s Website.',
      'By placing an order on this website, we assume you accept these terms and conditions. Do not continue to use Bazaar360 if you do not agree to take all of the terms and conditions stated on this page.',
      'Cash on Delivery (COD) orders require a valid phone number. We reserve the right to call or verify the mobile number before dispatching any order. Unverified orders or orders with invalid address fields will be cancelled immediately.',
      'All product descriptions, specifications, prices, and stock indicators are subject to change at any time without notice. We make every effort to display the colors and images of our products as accurately as possible.',
      'In no event shall Bazaar360, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.'
    ],
  },
  'shipping-policy': {
    title: 'Shipping & Delivery Policy',
    icon: Truck,
    content: [
      'We are committed to delivering your orders as quickly and reliably as possible. We offer Free Shipping on all orders sitewide.',
      'All orders are processed and dispatched within 24 hours of confirmation (excluding Sundays and national holidays).',
      'Once dispatched, estimated delivery times are 3 to 5 business days depending on your location. Deliveries to remote areas may take up to 7 business days.',
      'A delivery partner executive will call you before attempting delivery. Since this is a Cash on Delivery (COD) order, please make sure you are available to receive the package and have the exact cash amount ready.',
      'We attempt delivery up to 3 times. If the package remains undelivered after 3 attempts, it will be returned to our warehouse and the customer\'s COD privilege may be restricted for future orders.'
    ],
  },
  'refund-policy': {
    title: 'Refund & Return Policy',
    icon: RotateCcw,
    content: [
      'We offer a 7-Day Hassle-Free Return Policy for all verified products. If you receive a product that is damaged, defective, or not as described, you are eligible for a replacement or refund.',
      'To initiate a return, please contact our support team on WhatsApp at +91 98765 43210 or email us at support@bazaar360.com within 7 days of receiving the package. You will need to provide your Order Number and proof of damage (photos/videos).',
      'Once your return request is approved, our courier partner will pick up the item from your address within 2-3 business days.',
      'Upon receiving the returned item at our warehouse and conducting a quality check, we will process your refund. Since the order was paid via Cash on Delivery, refunds will be credited directly to your bank account or UPI ID provided during the return request.',
      'Refunds are processed within 5-7 business days after the returned product reaches our warehouse.'
    ],
  },
};

export default function PolicyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const policy = policies[slug];

  if (!policy) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[450px] p-6 text-center">
          <h2 className="text-xl font-bold text-slate-800">Policy Not Found</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const IconComponent = policy.icon;

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-slate-50/50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <IconComponent className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {policy.title}
              </h1>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-slate-500">
              {policy.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Support Box */}
            <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
              <span>Have questions about this policy? Contact us at </span>
              <a href="mailto:support@bazaar360.com" className="font-bold text-blue-600 hover:underline">
                support@bazaar360.com
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
