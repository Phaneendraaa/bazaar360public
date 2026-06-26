'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, ArrowLeft, Truck, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

// Form validation schema using Zod
const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^[0-9]{10,12}$/, 'Please enter a valid 10-12 digit mobile number'),
  alternateNumber: z.string().regex(/^[0-9]{10,12}$/, 'Please enter a valid 10-12 digit mobile number').optional().or(z.literal('')),
  houseNumber: z.string().min(1, 'House number/building name is required'),
  street: z.string().min(3, 'Street address is required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(/^[0-9]{5,6}$/, 'Please enter a valid 5-6 digit PIN code'),
  notes: z.string().optional(),
  confirmCorrect: z.boolean().refine((val) => val === true, 'You must confirm your shipping details are correct.'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const slug = searchParams.get('slug');
  const qtyParam = searchParams.get('qty');
  const quantity = qtyParam ? parseInt(qtyParam) : 1;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch product information for summary
  useEffect(() => {
    if (!slug) {
      router.push('/');
      return;
    }

    async function loadProduct() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const prods = await res.json();
          const found = prods.find((p: any) => p.slug === slug);
          if (found) {
            setProduct(found);
          } else {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Failed to load product details for checkout:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      alternateNumber: '',
      landmark: '',
      notes: '',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!product) return;
    
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: data.customerName,
          phoneNumber: data.phoneNumber,
          alternateNumber: data.alternateNumber || null,
          houseNumber: data.houseNumber,
          street: data.street,
          landmark: data.landmark || null,
          city: data.city,
          state: data.state,
          pinCode: data.pinCode,
          notes: data.notes || null,
          productSlug: product.slug,
          quantity: quantity,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to success page, pass order details via session storage or query params
        sessionStorage.setItem('last_order', JSON.stringify(result.order));
        router.push('/checkout/success');
      } else {
        setSubmitError(result.error || 'Failed to submit order. Please try again.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setSubmitError('A connection error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-400">Preparing checkout...</p>
        </div>
        <Footer />
      </>
    );
  }

  const codCharges = 0; // Free Cash on Delivery charges
  const subtotal = product ? product.price * quantity : 0;
  const finalTotal = subtotal + codCharges;

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-slate-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Product
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Left side: Checkout Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                Shipping & Delivery Address
              </h2>

              {submitError && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      {...register('customerName')}
                      className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.customerName ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.customerName && (
                      <span className="text-xs font-semibold text-red-500">{errors.customerName.message}</span>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      {...register('phoneNumber')}
                      className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.phoneNumber ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <span className="text-xs font-semibold text-red-500">{errors.phoneNumber.message}</span>
                    )}
                  </div>

                  {/* Alternate Mobile */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Alternate Mobile <span className="text-[10px] text-slate-400 italic">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Alternative number"
                      {...register('alternateNumber')}
                      className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                        errors.alternateNumber ? 'border-red-300 focus:ring-red-100' : ''
                      }`}
                    />
                    {errors.alternateNumber && (
                      <span className="text-xs font-semibold text-red-500">{errors.alternateNumber.message}</span>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">PIN Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 560001"
                      {...register('pinCode')}
                      className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.pinCode ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.pinCode && (
                      <span className="text-xs font-semibold text-red-500">{errors.pinCode.message}</span>
                    )}
                  </div>
                </div>

                {/* House No / Building */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">House / Flat No, Building Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 302, Green Meadows"
                    {...register('houseNumber')}
                    className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.houseNumber ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                  {errors.houseNumber && (
                    <span className="text-xs font-semibold text-red-500">{errors.houseNumber.message}</span>
                  )}
                </div>

                {/* Street address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Street Address, Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 1st Cross, Indiranagar"
                    {...register('street')}
                    className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.street ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                  {errors.street && (
                    <span className="text-xs font-semibold text-red-500">{errors.street.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {/* Landmark */}
                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Landmark <span className="text-[10px] text-slate-400 italic">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near City Mall"
                      {...register('landmark')}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru"
                      {...register('city')}
                      className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.city ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.city && (
                      <span className="text-xs font-semibold text-red-500">{errors.city.message}</span>
                    )}
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Karnataka"
                      {...register('state')}
                      className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.state ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.state && (
                      <span className="text-xs font-semibold text-red-500">{errors.state.message}</span>
                    )}
                  </div>
                </div>

                {/* Order Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Order Notes <span className="text-[10px] text-slate-400 italic">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Instructions for delivery (e.g. deliver after 4 PM, ring door bell...)"
                    {...register('notes')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>

                {/* Confirm details Checkbox */}
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('confirmCorrect')}
                      className="mt-0.5 h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold select-none leading-normal">
                      I confirm that all shipping details and numbers entered above are correct. I understand this order will be delivered with Cash on Delivery (COD).
                    </span>
                  </label>
                  {errors.confirmCorrect && (
                    <span className="mt-2 block text-xs font-semibold text-red-500">{errors.confirmCorrect.message}</span>
                  )}
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-all mt-6 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 fill-current" />
                      <span>Confirm Order (Cash on Delivery)</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right side: Order Summary */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
                  Order Summary
                </h3>

                {product && (
                  <div className="flex flex-col gap-4">
                    {/* Selected Product */}
                    <div className="flex justify-between gap-4 py-2 border-b border-slate-50">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{product.title}</h4>
                        <span className="text-xs text-slate-400 mt-0.5 block">
                          Qty: <span className="font-bold text-slate-600">{quantity}</span>
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </div>

                    {/* Price Calculation details */}
                    <div className="flex flex-col gap-2.5 text-sm py-2 border-b border-slate-50">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Items Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Shipping Fee</span>
                        <span className="text-emerald-600 font-semibold uppercase">Free</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>COD Charges</span>
                        <span className="text-emerald-600 font-semibold uppercase">Free</span>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-base font-bold text-slate-800">Final Total (COD)</span>
                      <span className="text-2xl font-extrabold text-blue-600">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust badges side panel */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Secure Checkout Assured</h4>
                
                <div className="flex items-center gap-3.5 text-xs text-slate-500">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-700">100% Risk Free Ordering</h5>
                    <p className="mt-0.5 leading-relaxed text-slate-400">Pay only when you receive the product at your door.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-500">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Truck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-700">Speedy Dispatch</h5>
                    <p className="mt-0.5 leading-relaxed text-slate-400">Shipped with professional courier services in 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-400">Loading checkout session...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
