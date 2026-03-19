import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Minus, Plus, Heart, Share2, ChevronDown, Scale, MessageCircle, Ruler, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { formatPrice } from '../utils/formatPrice';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const { products, loading } = useProducts();
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [openTab, setOpenTab] = useState<string | null>('description');
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [askForm, setAskForm] = useState({ name: '', email: '', phone: '', message: '' });

  const product = products.find((p) => p.handle === handle);

  // Reset state when product changes
  useEffect(() => {
    setSelectedVariant(null);
    setQuantity(1);
    setMainImage(0);
    setOpenTab('description');
  }, [handle]);

  if (loading) return null;

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-medium mb-4">Product Not Found</h1>
        <Link to="/collections/all-products" className="text-primary hover:underline">
          Browse All Products
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.handle);
  const isSoldOut = product.availability === 'out_of_stock';
  const currentVariant = selectedVariant !== null ? product.variants[selectedVariant] : null;
  const currentPrice = currentVariant?.price ?? product.price;

  const related = products
    .filter((p) => p.category === product.category && p.handle !== product.handle)
    .slice(0, 8);

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, currentVariant);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.seoTitle || product.title} | Viet Jewelers - Handcrafted Jewelry Hanoi</title>
        <meta
          name="description"
          content={product.seoDescription || `${product.title} - Handcrafted ${product.type || 'jewelry'} by Viet Jewelers, Hanoi Old Quarter. Shop authentic Vietnamese silver & gold jewelry.`}
        />
        <meta property="og:title" content={product.seoTitle || product.title} />
        <meta property="og:description" content={product.seoDescription || `${product.title} - Handcrafted jewelry by Viet Jewelers`} />
        <meta property="og:image" content={product.primaryImage} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="VND" />
      </Helmet>

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container py-3">
          <div className="breadcrumb justify-start">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/collections/all-products">All Products</Link>
            <span>/</span>
            <span>{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-background-secondary rounded overflow-hidden mb-3">
              <img
                src={product.images[mainImage]}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                      i === mainImage ? 'border-foreground' : 'border-border'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.type && (
              <span className="text-xs uppercase tracking-widest text-foreground-secondary mb-2 block">
                {product.type}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-medium mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              {product.compareAtPrice ? (
                <>
                  <span className="text-xl price-sale">{formatPrice(currentPrice)}</span>
                  <span className="text-base price-compare">{formatPrice(product.compareAtPrice)}</span>
                </>
              ) : (
                <span className="text-xl font-medium">{formatPrice(currentPrice)}</span>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">
                  Size: {currentVariant?.title || 'Select'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.title}
                      onClick={() => setSelectedVariant(i)}
                      disabled={!v.available}
                      className={`px-4 py-2 border text-sm rounded transition-colors ${
                        selectedVariant === i
                          ? 'border-foreground bg-foreground text-white'
                          : v.available
                          ? 'border-border hover:border-foreground'
                          : 'border-border text-foreground-secondary line-through opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-foreground-secondary hover:text-foreground"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2.5 text-sm min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-foreground-secondary hover:text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`btn flex-1 ${
                  isSoldOut ? 'bg-foreground-secondary text-white cursor-not-allowed' : 'btn-primary'
                }`}
              >
                {isSoldOut ? 'Sold Out' : 'Add to cart'}
              </button>
            </div>

            {/* Buy it now */}
            {!isSoldOut && (
              <button className="btn btn-outline w-full mb-6">Buy it now</button>
            )}

            {/* Actions */}
            <div className="flex items-center flex-wrap gap-y-2 py-4 border-t border-border text-sm">
              <button
                onClick={() => toggleItem(product)}
                className={`flex items-center gap-2 hover:text-primary transition-colors ${
                  inWishlist ? 'text-primary' : 'text-foreground-secondary'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                Wishlist
              </button>
              <span className="mx-3 text-border">|</span>
              <button
                onClick={() => {}}
                className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors"
              >
                <Scale className="w-4 h-4" />
                Compare
              </button>
              <span className="mx-3 text-border">|</span>
              <button
                onClick={() => setAskModalOpen(true)}
                className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Ask a question
              </button>
              <span className="mx-3 text-border">|</span>
              <button
                onClick={() => {}}
                className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors"
              >
                <Ruler className="w-4 h-4" />
                Size guide
              </button>
              <span className="mx-3 text-border">|</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Shipping info */}
            <div className="py-4 border-t border-border space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-foreground-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75M2.25 14.25h1.875c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H2.25m0-3.75V7.5A2.25 2.25 0 0 1 4.5 5.25h11.25a2.25 2.25 0 0 1 2.25 2.25v6.75" />
                </svg>
                <p>
                  <strong>Estimated Delivery:</strong>{' '}
                  <span className="text-foreground-secondary">
                    {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' - '}
                    {new Date(Date.now() + 9 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-foreground-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                <p>
                  <strong>Free Shipping & Returns:</strong>{' '}
                  <span className="text-foreground-secondary">On all orders over $75</span>
                </p>
              </div>
            </div>

            {/* Collapsible tabs */}
            <div className="border-t border-border">
              {/* Description */}
              <div className="border-b border-border">
                <button
                  onClick={() => setOpenTab(openTab === 'description' ? null : 'description')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold uppercase tracking-wider"
                >
                  Product Description
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openTab === 'description' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openTab === 'description' && product.description && (
                  <div
                    className="pb-4 text-sm text-foreground-secondary leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>

              {/* Warranty */}
              <div className="border-b border-border">
                <button
                  onClick={() => setOpenTab(openTab === 'warranty' ? null : 'warranty')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold uppercase tracking-wider"
                >
                  Warranty Policy
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openTab === 'warranty' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openTab === 'warranty' && (
                  <div className="pb-4 text-sm text-foreground-secondary leading-relaxed">
                    <p><strong>We'd like to share with you the warranty policy of Viet Jewelers:</strong></p>
                    <p className="mt-2">1. Free Repair and Gold Plating: Within the first month after your purchase, you will receive free support for repairs (such as breaks, cracks, or lost CZ stones) and gold plating (for gold-plated products). After the first month period, repair cost is from 60k for soldering and 60k for gold-plate.</p>
                    <p className="mt-2">2. Lifetime Free Polishing Service.</p>
                    <p className="mt-2">3. Product Buyback Policy: If you need to, we also buy back products at the raw material price. This makes it easy for you to change or upgrade your items when necessary.</p>
                    <p className="mt-2">If you have any questions or need more information, feel free to contact Viet Jewelers team!</p>
                  </div>
                )}
              </div>

              {/* Return & Refund */}
              <div className="border-b border-border">
                <button
                  onClick={() => setOpenTab(openTab === 'return' ? null : 'return')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold uppercase tracking-wider"
                >
                  Return & Refund Policy
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openTab === 'return' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openTab === 'return' && (
                  <div className="pb-4 text-sm text-foreground-secondary leading-relaxed">
                    <p>We accept returns within 14 days of delivery for items in original condition.</p>
                    <p className="mt-2">Custom-made items are non-refundable.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
              <div className="text-sm text-foreground-secondary mb-4">
                No reviews yet. Any feedback? Let us know
              </div>
              <button
                onClick={() => {}}
                className="btn btn-outline text-sm px-6 py-2"
              >
                Write review
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-medium mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Products */}
        {related.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-medium mb-8">Recently Viewed Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Ask a Question Modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setAskModalOpen(false)}
          />
          <div className="relative bg-background rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Ask a Question</h3>
              <button
                onClick={() => setAskModalOpen(false)}
                className="text-foreground-secondary hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAskModalOpen(false);
                setAskForm({ name: '', email: '', phone: '', message: '' });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={askForm.name}
                  onChange={(e) => setAskForm({ ...askForm, name: e.target.value })}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={askForm.email}
                  onChange={(e) => setAskForm({ ...askForm, email: e.target.value })}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  placeholder="Your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={askForm.phone}
                  onChange={(e) => setAskForm({ ...askForm, phone: e.target.value })}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={askForm.message}
                  onChange={(e) => setAskForm({ ...askForm, message: e.target.value })}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground min-h-[100px] resize-y"
                  placeholder="Your question..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Submit Now
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
