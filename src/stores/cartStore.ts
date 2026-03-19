import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Variant, CartItem } from '../types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant?: Variant | null) => void;
  removeItem: (handle: string, variantTitle?: string) => void;
  updateQuantity: (handle: string, quantity: number, variantTitle?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant = null) => {
        const items = get().items;
        const key = variant ? `${product.handle}-${variant.title}` : product.handle;
        const existing = items.find(item =>
          variant
            ? item.product.handle === product.handle && item.variant?.title === variant.title
            : item.product.handle === product.handle && !item.variant
        );

        if (existing) {
          set({
            items: items.map(item =>
              item === existing
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { product, variant, quantity: 1 }],
            isOpen: true,
          });
        }
      },

      removeItem: (handle, variantTitle) => {
        set({
          items: get().items.filter(item =>
            variantTitle
              ? !(item.product.handle === handle && item.variant?.title === variantTitle)
              : !(item.product.handle === handle && !item.variant)
          ),
        });
      },

      updateQuantity: (handle, quantity, variantTitle) => {
        if (quantity <= 0) {
          get().removeItem(handle, variantTitle);
          return;
        }
        set({
          items: get().items.map(item =>
            (variantTitle
              ? item.product.handle === handle && item.variant?.title === variantTitle
              : item.product.handle === handle && !item.variant)
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
          0
        ),
    }),
    {
      name: 'vj-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
