'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ShoppingBag, ArrowRight, Truck, PhoneCall } from 'lucide-react';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    // Read the saved order details from session storage
    const savedOrder = sessionStorage.getItem('last_order');
    if (!savedOrder) {
      router.replace('/');
      return;
    }
    
    setOrder(JSON.parse(savedOrder));

    // Clear it so page refreshes don't persist it forever (optional, or keep it)
    // For now we can keep it so they can see it, and it will clear on tab close.

    // Calculate delivery date estimates
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateMin = new Date();
    dateMin.setDate(dateMin.getDate() + 3);
    const dateMax = new Date();
    dateMax.setDate(dateMax.getDate() + 5);
    setDeliveryDate(`${dateMin.toLocaleDateString('en-US', options)} - ${dateMax.toLocaleDateString('en-US', options)}`);
  }, [router]);

  if (!order) {
    return null; // or loading spinner
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-slate-50/50 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Order Placed Successfully!
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Thank you for shopping with Bazaar360. Your order is being processed.
            </p>

            {/* Order Info Panel */}
            <div className="mt-8 border-t border-b border-slate-50 py-6 text-left space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Order Number:</span>
                <span className="font-bold text-blue-600">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Product Ordered:</span>
                <span className="font-bold text-slate-800 line-clamp-1 max-w-[250px]">{order.productName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Quantity:</span>
                <span className="font-bold text-slate-800">{order.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Customer Name:</span>
                <span className="font-bold text-slate-800">{order.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Total Amount (COD):</span>
                <span className="font-bold text-slate-800">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Delivery Estimation */}
            <div className="mt-6 rounded-2xl bg-blue-50/50 border border-blue-50/80 p-5 text-left flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900">Estimated Delivery Window</h3>
                <p className="text-sm font-semibold text-blue-700 mt-1">{deliveryDate}</p>
                <p className="text-xs text-blue-500 mt-1">
                  Our courier partner will contact you via phone prior to delivery. Please keep cash ready.
                </p>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow shadow-blue-100 hover:bg-blue-700 cursor-pointer"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>Continue Shopping</span>
              </button>
              
              <a
                href="https://wa.me/919063454476"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                <PhoneCall className="h-4.5 w-4.5 text-emerald-600" />
                <span>Support Inquiry</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
