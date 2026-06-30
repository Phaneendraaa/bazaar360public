'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import TrustBadges from '@/components/TrustBadges';
import { Search, Loader2 } from 'lucide-react';

const categories = [
  { name: 'All Collection', id: 'all' },
  { name: 'Indian Wear', id: 'indian-wear' },
  { name: 'Western Wear', id: 'western-wear' },
  { name: 'Accessories', id: 'accessories' },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch products from our API on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;

    let tags: string[] = [];
    try {
      if (Array.isArray(product.tags)) {
        tags = product.tags;
      } else if (typeof product.tags === 'string') {
        tags = JSON.parse(product.tags);
      }
    } catch (e) {}

    return tags.includes(selectedCategory);
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const scrollToProducts = () => {
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-tr from-rose-50/70 via-amber-50/50 to-purple-50/60 py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold tracking-wide uppercase text-blue-700">
              Welcome to Suta & Stitch
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-serif">
              Handcrafted Elegance for{' '}
              <span className="text-blue-600">Your Wardrobe</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Explore our exclusive collection of colorful Indian wear, western wear, and premium designer accessories. Free shipping & 100% Cash on Delivery (COD).
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={scrollToProducts}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Shop Now
              </button>
            </div>
          </div>
        </section>

        {/* Search and Products Section */}
        <section id="products-section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-serif">
                Our Collection
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Browse our curated luxury wear. Risk-free cash-on-delivery checkout.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-sm shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(6); // Reset pagination on search change
                }}
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mb-10 flex flex-wrap gap-2 sm:gap-3 border-b border-slate-100 pb-6">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleCount(6); // Reset pagination
                  }}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-rose-100 scale-102'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-400">Loading products...</p>
            </div>
          ) : (
            <>
              {displayedProducts.length > 0 ? (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={handleLoadMore}
                        className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        Load More Products
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                  <p className="text-base font-semibold text-slate-600">No products found</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Try adjusting your keywords or search query.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Trust Badges Banner */}
        <section className="bg-slate-50/30 border-t border-b border-slate-100 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-xl font-bold text-slate-800 font-serif">Why Shop with Suta & Stitch?</h3>
              <p className="text-sm text-slate-400 mt-1">We make ordering simple, secure, and risk-free.</p>
            </div>
            <TrustBadges />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
