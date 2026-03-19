import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../utils/formatPrice';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  const [noteOpen, setNoteOpen] = useState(false);
  const [noteValue, setNoteValue] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [shippingOpen, setShippingOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponValue, setCouponValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[80]"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white z-[90] transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-base font-semibold uppercase tracking-wider">
            Shopping Cart
          </h3>
          <button onClick={closeCart} className="text-foreground hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <ShoppingBag className="w-16 h-16 text-border mb-4" />
              <p className="text-foreground-secondary text-sm mb-6">Your cart is currently empty.</p>
              <Link
                to="/collections/all-products"
                onClick={closeCart}
                className="btn btn-primary"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => {
                const key = item.variant
                  ? `${item.product.handle}-${item.variant.title}`
                  : item.product.handle;
                const price = item.variant?.price ?? item.product.price;

                return (
                  <div key={key} className="flex gap-3 p-4">
                    <Link
                      to={`/products/${item.product.handle}`}
                      onClick={closeCart}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.handle}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.title}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-foreground-secondary mt-0.5">
                          {item.variant.title}
                        </p>
                      )}
                      <p className="text-sm font-medium mt-1">{formatPrice(price)}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() => updateQuantity(item.product.handle, item.quantity - 1, item.variant?.title)}
                            className="px-2 py-1 text-foreground-secondary hover:text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.handle, item.quantity + 1, item.variant?.title)}
                            className="px-2 py-1 text-foreground-secondary hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.handle, item.variant?.title)}
                          className="text-foreground-secondary hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expandable Sections */}
        {items.length > 0 && (
          <div className="border-t border-border">
            {/* Note Section */}
            <div className="border-b border-border">
              <button
                onClick={() => setNoteOpen(!noteOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground hover:text-primary transition-colors"
              >
                <span>Add note for seller</span>
                <span className="text-lg leading-none">{noteOpen ? '−' : '+'}</span>
              </button>
              {noteOpen && (
                <div className="px-4 pb-3 space-y-2">
                  <textarea
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    placeholder="Special instructions for seller..."
                    className="w-full border border-border rounded p-2 text-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setNoteValue(savedNote); setNoteOpen(false); }}
                      className="btn btn-outline btn-sm text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { setSavedNote(noteValue); setNoteOpen(false); }}
                      className="btn btn-primary btn-sm text-xs"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Section */}
            <div className="border-b border-border">
              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground hover:text-primary transition-colors"
              >
                <span>Estimate shipping rates</span>
                <span className="text-lg leading-none">{shippingOpen ? '−' : '+'}</span>
              </button>
              {shippingOpen && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-foreground-secondary">
                    Shipping rates will be calculated at checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Coupon Section */}
            <div className="border-b border-border">
              <button
                onClick={() => setCouponOpen(!couponOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground hover:text-primary transition-colors"
              >
                <span>Add a discount code</span>
                <span className="text-lg leading-none">{couponOpen ? '−' : '+'}</span>
              </button>
              {couponOpen && (
                <div className="px-4 pb-3 space-y-2">
                  <input
                    type="text"
                    value={couponValue}
                    onChange={(e) => setCouponValue(e.target.value)}
                    placeholder="Discount code"
                    className="w-full border border-border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setCouponValue(''); setCouponOpen(false); }}
                      className="btn btn-outline btn-sm text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setCouponOpen(false)}
                      className="btn btn-primary btn-sm text-xs"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase">Subtotal</span>
              <span className="text-base font-semibold">{formatPrice(subtotal())}</span>
            </div>
            <p className="text-xs text-foreground-secondary">
              Taxes and shipping calculated at checkout
            </p>
            <Link
              to="/cart"
              onClick={closeCart}
              className="btn btn-outline w-full"
            >
              View Cart
            </Link>
            <button className="btn btn-primary w-full">
              Check out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
