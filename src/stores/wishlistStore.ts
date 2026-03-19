import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (handle: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (handle: string) => boolean;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isInWishlist(product.handle)) {
          set({ items: [...get().items, product] });
        }
      },

      removeItem: (handle) => {
        set({ items: get().items.filter(item => item.handle !== handle) });
      },

      toggleItem: (product) => {
        if (get().isInWishlist(product.handle)) {
          get().removeItem(product.handle);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (handle) => get().items.some(item => item.handle === handle),
      totalItems: () => get().items.length,
    }),
    {
      name: 'vj-wishlist',
    }
  )
);
