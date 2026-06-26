import Link from 'next/link';
import Image from 'next/image';
import { Star, Truck, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number | null;
    images: any; // Can be string or JSON array
    stockQuantity: number;
    SKU: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
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

  // Fallback image
  const primaryImage = imageUrls[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  // Calculate discount percentage
  let discountPercentage = 0;
  if (product.originalPrice && product.originalPrice > product.price) {
    discountPercentage = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  }

  // Generate a realistic reviews count based on the product ID or slug
  const reviewsCount = Math.floor((product.slug.charCodeAt(0) * 3) % 45) + 12;

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-xl hover:shadow-slate-100"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          priority={false}
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && !isOutOfStock && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Save {discountPercentage}%
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-[1px]">
            <span className="rounded-full bg-red-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
              Out of Stock
            </span>
          </div>
        )}

        {/* COD Badge */}
        {!isOutOfStock && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm border border-slate-100">
            <Truck className="h-3 w-3 text-blue-600" />
            <span>COD Available</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        
        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            4.8 ({reviewsCount} reviews)
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600">
          {product.title}
        </h3>

        {/* Price & Action */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
