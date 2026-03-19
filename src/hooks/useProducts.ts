import { useState, useEffect } from 'react';
import type { Product, Category, Collection } from '../types/product';

let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;
let cachedCollections: Collection[] | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cachedProducts || []);
  const [categories, setCategories] = useState<Category[]>(cachedCategories || []);
  const [collections, setCollections] = useState<Collection[]>(cachedCollections || []);
  const [loading, setLoading] = useState(!cachedProducts);

  useEffect(() => {
    if (cachedProducts && cachedCategories && cachedCollections) {
      setProducts(cachedProducts);
      setCategories(cachedCategories);
      setCollections(cachedCollections);
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/data/products.json').then(r => r.json()),
      fetch('/data/categories.json').then(r => r.json()),
      fetch('/data/collections.json').then(r => r.json()),
    ]).then(([p, c, col]) => {
      cachedProducts = p;
      cachedCategories = c;
      cachedCollections = col;
      setProducts(p);
      setCategories(c);
      setCollections(col);
      setLoading(false);
    });
  }, []);

  return { products, categories, collections, loading };
}

export function filterProducts(
  products: Product[],
  filters: {
    category?: string;
    collection?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    availability?: 'in_stock' | 'out_of_stock';
  }
): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter(p => p.category === filters.category);
  }
  if (filters.collection) {
    result = result.filter(p => p.collections.includes(filters.collection!));
  }
  if (filters.type) {
    result = result.filter(p => p.type.toLowerCase() === filters.type!.toLowerCase());
  }
  if (filters.minPrice !== undefined) {
    result = result.filter(p => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter(p => p.price <= filters.maxPrice!);
  }
  if (filters.availability) {
    result = result.filter(p => p.availability === filters.availability);
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-new':
        // Already sorted by newest in data
        break;
      case 'date-old':
        result.reverse();
        break;
    }
  }

  return result;
}
