import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { X, Minus, Plus, Heart } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import type { Product, Variant } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';

interface QuickViewModalProps {
  products: Product[];
}

export default function QuickViewModal({ products }: QuickViewModalProps) {
  const { quickViewProduct, closeQuickView } = useUIStore();
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find((p) => p.handle === quickViewProduct) || null;
  const inWishlist = product ? isInWishlist(product.handle) : false;
  const isSoldOut = product?.availability === 'out_of_stock';

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      setSelectedVariant(product.variants.length > 0 ? product.variants[0] : null);
      setQuantity(1);
      setActiveImageIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeQuickView]);

  if (!product) return null;

  const currentPrice = selectedVariant?.price ?? product.price;

  const handleAddToCart = () => {
    if (!isSoldOut) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedVariant ?? undefined);
      }
      closeQuickView();
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeQuickView}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="p-6">
            <div className="aspect-square bg-background-secondary rounded overflow-hidden mb-3">
              <img
                src={product.images[activeImageIndex] || product.primaryImage}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                      idx === activeImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 pt-10 md:pt-6">
            <h2 className="text-lg font-medium text-heading mb-2">{product.title}</h2>

            <div className="flex items-center gap-2 mb-4">
              {product.compareAtPrice ? (
                <>
                  <span className="text-lg font-medium text-sale">{formatPrice(currentPrice)}</span>
                  <span className="text-sm text-foreground-secondary line-through">{formatPrice(product.compareAtPrice)}</span>
                </>
              ) : (
                <span className="text-lg font-medium">{formatPrice(currentPrice)}</span>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2 block">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.title}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!v.available}
                      className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                        selectedVariant?.title === v.title
                          ? 'border-foreground bg-foreground text-white'
                          : v.available
                            ? 'border-border hover:border-foreground'
                            : 'border-border text-foreground-secondary/50 cursor-not-allowed line-through'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2 block">
                Quantity
              </label>
              <div className="inline-flex items-center border border-border rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-background-secondary transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-background-secondary transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`w-full py-3 text-sm font-medium uppercase tracking-wider rounded transition-colors ${
                  isSoldOut
                    ? 'bg-foreground-secondary text-white cursor-not-allowed'
                    : 'bg-button text-button-text hover:bg-primary'
                }`}
              >
                {isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </button>

              <button
                onClick={() => product && toggleItem(product)}
                className="w-full py-3 text-sm font-medium uppercase tracking-wider border border-border rounded hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* View full details */}
            <Link
              to={`/products/${product.handle}`}
              onClick={closeQuickView}
              className="text-sm text-primary hover:underline"
            >
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
