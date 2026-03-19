import { useState } from 'react';
import { Link } from 'react-router';
import { Heart, Eye } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useUIStore } from '../../stores/uiStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const openQuickView = useUIStore((s) => s.openQuickView);
  const inWishlist = isInWishlist(product.handle);
  const isSoldOut = product.availability === 'out_of_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSoldOut) {
      addToCart(product);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.handle);
  };

  return (
    <div className="group" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link to={`/products/${product.handle}`} className="block">
        {/* Image container */}
        <div className="relative overflow-hidden bg-background-secondary aspect-[3/4]">
          {/* Primary image */}
          <img
            src={product.primaryImage}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              hovered && product.secondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          {/* Secondary image (hover) */}
          {product.secondaryImage && (
            <img
              src={product.secondaryImage}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isSoldOut && (
              <span className="badge badge-soldout">Sold Out</span>
            )}
            {product.compareAtPrice && !isSoldOut && (
              <span className="badge badge-sale">Sale</span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <Heart
              className={`w-4 h-4 ${inWishlist ? 'fill-primary text-primary' : 'text-foreground'}`}
            />
          </button>

          {/* Hover action buttons */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider text-center transition-colors rounded-sm ${
                isSoldOut
                  ? 'bg-foreground-secondary text-white cursor-not-allowed'
                  : 'bg-button text-button-text hover:bg-primary'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Add to Cart'}
            </button>
            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white flex items-center justify-center rounded-sm hover:bg-primary hover:text-white transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-3 text-center">
          <h3 className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
          <div className="mt-1.5 flex items-center justify-center gap-2">
            {product.compareAtPrice ? (
              <>
                <span className="price-sale text-sm">{formatPrice(product.price)}</span>
                <span className="price-compare text-xs">{formatPrice(product.compareAtPrice)}</span>
              </>
            ) : (
              <span className="price-regular text-sm">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
