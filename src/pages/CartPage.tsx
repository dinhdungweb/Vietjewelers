import { Link } from 'react-router';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utils/formatPrice';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Cart</span>
        </div>
        <h1>Your Cart</h1>
      </div>

      <div className="container section-spacing pb-20">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-border mx-auto mb-4" />
            <p className="text-foreground-secondary mb-6">Your cart is empty</p>
            <Link to="/collections/all-products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 border-b border-border text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const key = item.variant
                    ? `${item.product.handle}-${item.variant.title}`
                    : item.product.handle;
                  const price = item.variant?.price ?? item.product.price;

                  return (
                    <div key={key} className="py-4 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:gap-4 md:items-center">
                      <div className="flex gap-4">
                        <Link to={`/products/${item.product.handle}`} className="flex-shrink-0">
                          <img
                            src={item.product.primaryImage}
                            alt={item.product.title}
                            className="w-20 h-20 object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/products/${item.product.handle}`}
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-foreground-secondary mt-0.5">{item.variant.title}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm mt-2 md:mt-0">{formatPrice(price)}</div>
                      <div className="mt-2 md:mt-0">
                        <div className="inline-flex items-center border border-border rounded">
                          <button
                            onClick={() => updateQuantity(item.product.handle, item.quantity - 1, item.variant?.title)}
                            className="px-2.5 py-1.5 text-foreground-secondary hover:text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1.5 text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.handle, item.quantity + 1, item.variant?.title)}
                            className="px-2.5 py-1.5 text-foreground-secondary hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-medium mt-2 md:mt-0">{formatPrice(price * item.quantity)}</div>
                      <button
                        onClick={() => removeItem(item.product.handle, item.variant?.title)}
                        className="mt-2 md:mt-0 text-foreground-secondary hover:text-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-background-secondary rounded p-6">
                <h3 className="text-base font-semibold uppercase tracking-wider mb-4">Order Summary</h3>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-sm text-foreground-secondary">Subtotal</span>
                  <span className="text-sm font-medium">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-sm text-foreground-secondary">Shipping</span>
                  <span className="text-sm text-foreground-secondary">Calculated at checkout</span>
                </div>
                <div className="flex justify-between py-3 mb-4">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-semibold">{formatPrice(subtotal())}</span>
                </div>
                <button className="btn btn-primary w-full">Check out</button>
                <Link
                  to="/collections/all-products"
                  className="block text-center text-sm text-foreground-secondary hover:text-primary mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
