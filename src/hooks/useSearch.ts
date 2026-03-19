import { useMemo } from 'react';
import Fuse from 'fuse.js';
import type { Product } from '../types/product';

export function useSearch(products: Product[]) {
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ['title', 'type', 'tags', 'categoryLabel'],
        threshold: 0.3,
        includeScore: true,
      }),
    [products]
  );

  return (query: string, limit = 10): Product[] => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit }).map(r => r.item);
  };
}
