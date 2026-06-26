'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import TrustBadges from '@/components/TrustBadges';
import { Loader2, ShieldCheck, Truck, RotateCcw, AlertTriangle, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  // Fetch product and reviews
  useEffect(() => {
    if (!slug) return;
    
    async function loadData() {
      try {
        const [prodRes, revRes] = await Promise.all([
          fetch(`/api/products`),
          fetch(`/api/reviews?productSlug=${slug}`),
        ]);

        if (prodRes.ok) {
          const prods = await prodRes.json();
          const foundProduct = prods.find((p: any) => p.slug === slug);
          if (foundProduct) {
            setProduct(foundProduct);
          }
        }
        
        if (revRes.ok) {
          const revs = await revRes.json();
          setReviews(revs);
        }
      } catch (error) {
        console.error('Failed to load product page details:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Calculate delivery date estimates (e.g. 3-5 days from today)
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateMin = new Date();
    dateMin.setDate(dateMin.getDate() + 3);
    const dateMax = new Date();
    dateMax.setDate(dateMax.getDate() + 5);
    
    setEstimatedDelivery(`${dateMin.toLocaleDateString('en-US', options)} - ${dateMax.toLocaleDateString('en-US', options)}`);
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-400">Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] text-center p-6">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            We couldn't find the product you're looking for. It may have been removed or the link is broken.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Parse images JSON safely
  let imageUrls: string[] = [];
  try {
    if (Array.isArray(product.images)) {
      imageUrls = product.images;
    } else if (typeof product.images === 'string') {
      imageUrls = JSON.parse(product.images);
    }
  } catch (e) {
    imageUrls = [];
  }

  // Parse description lines to gracefully isolate Highlights & Specifications sections
  const descLines = product.description.split('\n');
  
  let highlightsIndex = descLines.findIndex((line: string) => line.trim().startsWith('Highlights:'));
  let specsIndex = descLines.findIndex((line: string) => line.trim().startsWith('Specifications:'));
  
  let highlights: string[] = [];
  if (highlightsIndex !== -1) {
    const endIdx = specsIndex > highlightsIndex ? specsIndex : descLines.length;
    highlights = descLines
      .slice(highlightsIndex + 1, endIdx)
      .map((line: string) => line.trim())
      .filter((line: string) => line.startsWith('- '))
      .map((line: string) => line.replace(/^- /, ''));
  }
  
  let specifications: string[] = [];
  if (specsIndex !== -1) {
    const endIdx = highlightsIndex > specsIndex ? highlightsIndex : descLines.length;
    specifications = descLines
      .slice(specsIndex + 1, endIdx)
      .map((line: string) => line.trim())
      .filter((line: string) => line.startsWith('- '))
      .map((line: string) => line.replace(/^- /, ''));
  }
  
  let mainDescLines = [...descLines];
  if (highlightsIndex !== -1 && specsIndex !== -1) {
    const startToRemove = Math.min(highlightsIndex, specsIndex);
    mainDescLines = descLines.slice(0, startToRemove);
  } else if (highlightsIndex !== -1) {
    mainDescLines = descLines.slice(0, highlightsIndex);
  } else if (specsIndex !== -1) {
    mainDescLines = descLines.slice(0, specsIndex);
  }
  
  const mainDesc = mainDescLines.join('\n').trim();

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stockQuantity <= 0;
  const staticStockLimit = isOutOfStock ? 0 : ((product.slug.charCodeAt(0) % 2 === 0) ? 9 : 10);

  const handleIncrement = () => {
    if (quantity < staticStockLimit) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleOrderRedirect = () => {
    if (isOutOfStock) return;
    router.push(`/checkout?slug=${product.slug}&qty=${quantity}`);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-white pb-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            
            {/* Left Column: Swipe Gallery */}
            <div className="lg:col-span-6">
              <ImageGallery images={imageUrls} videoUrl={product.video} />
            </div>

            {/* Right Column: Info & Checkout Link */}
            <div className="flex flex-col lg:col-span-6">
              <div className="border-b border-slate-100 pb-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  <Truck className="h-3 w-3" />
                  Free Shipping & COD
                </span>
                
                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {product.title}
                </h1>
                
                {/* Product SKU */}
                <span className="mt-1 block text-xs text-slate-400">SKU: {product.SKU}</span>
                
                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.originalPrice && (
                    <span className="text-lg font-medium text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery and Trust Stats */}
              <div className="mt-5 space-y-3 rounded-2xl border border-slate-100 p-4 bg-slate-50/50">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Truck className="h-4.5 w-4.5 text-blue-600" />
                  <div>
                    <span>Estimated Delivery: </span>
                    <span className="font-semibold text-slate-800">{estimatedDelivery}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <RotateCcw className="h-4.5 w-4.5 text-blue-600" />
                  <span>Return Policy: </span>
                  <span className="font-semibold text-slate-800">7-Day Free Returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
                  <span>COD Option: </span>
                  <span className="font-semibold text-emerald-700">Cash on Delivery Available (No Advance Needed)</span>
                </div>
              </div>

              {/* Highlights Bullet List */}
              {highlights.length > 0 && (
                <div className="mt-6 border-b border-slate-100 pb-5">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Product Highlights</h3>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-500">
                    {highlights.map((h: string, i: number) => (
                      <li key={i}>{h.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector & Checkout CTA */}
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-600">Quantity:</span>
                  <div className="flex items-center rounded-full border border-slate-200 p-1">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= staticStockLimit || isOutOfStock}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Stock status indicator */}
                  <span className="text-xs font-semibold">
                    {isOutOfStock ? (
                      <span className="text-red-600">Out of Stock</span>
                    ) : (
                      <span className="text-amber-600">Only {staticStockLimit} items left!</span>
                    )}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleOrderRedirect}
                    disabled={isOutOfStock}
                    className="flex w-full items-center justify-center rounded-full bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-colors"
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Place Order Now (Cash on Delivery)'}
                  </button>

                  <div className="flex justify-center gap-6 mt-3 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">✔ Cash on Delivery</span>
                    <span className="flex items-center gap-1">✔ Quality Inspected</span>
                    <span className="flex items-center gap-1">✔ Fast & Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Long Description and Specs Section */}
          <div className="mt-16 border-t border-slate-100 pt-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
              {/* Product description */}
              <div className="md:col-span-7">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Detailed Description</h3>
                <div className="text-sm leading-relaxed text-slate-500 whitespace-pre-wrap max-w-none">
                  {mainDesc}
                </div>
              </div>

              {/* Specifications table */}
              {specifications.length > 0 && (
                <div className="md:col-span-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Specifications</h3>
                  <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                    <table className="w-full text-left text-sm text-slate-500">
                      <tbody>
                        {specifications.map((spec: string, i: number) => {
                          const parts = spec.replace(/^- /, '').split(': ');
                          const label = parts[0] || '';
                          const value = parts.slice(1).join(': ') || '';
                          return (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-semibold text-slate-700 bg-slate-50/30 w-1/3">{label}</td>
                              <td className="px-4 py-3 text-slate-500">{value}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <section className="mt-16 border-t border-slate-100 pt-10">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Customer Reviews</h3>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                     <h5 className="font-semibold text-slate-800 text-sm">{rev.customerName}</h5>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{rev.comment}</p>

                    {/* Render review images if any */}
                    {rev.images && (() => {
                      let parsedImages: string[] = [];
                      try {
                        parsedImages = Array.isArray(rev.images)
                          ? rev.images
                          : JSON.parse(rev.images as string);
                      } catch (e) {}

                      return parsedImages.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {parsedImages.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm shrink-0">
                              <img
                                src={imgUrl}
                                alt={`Review image ${imgIdx + 1}`}
                                className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                onClick={() => setActiveLightboxImage(imgUrl)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-400 bg-slate-50/50">
                <p className="text-sm font-semibold">No reviews yet for this product</p>
                <p className="text-xs text-slate-400 mt-0.5">Be the first to share your thoughts!</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Sticky Order Button Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white p-3 shadow-2xl flex items-center justify-between gap-4 lg:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Price</span>
          <span className="text-lg font-bold text-slate-900">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
        </div>
        <button
          onClick={handleOrderRedirect}
          disabled={isOutOfStock}
          className="flex-1 rounded-full bg-blue-600 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:bg-slate-200 transition-colors"
        >
          {isOutOfStock ? 'Out of Stock' : 'Order COD'}
        </button>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl p-1 animate-in zoom-in-95 duration-200 cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeLightboxImage}
              alt="Review Fullsize"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
