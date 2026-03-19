import { useState } from 'react';
import { Link } from 'react-router';
import ProductCard from '../ui/ProductCard';
import type { Product } from '../../types/product';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<'best-sellers' | 'new-arrivals'>('best-sellers');

  // Best sellers = highest price products (proxy for popularity)
  const bestSellers = [...products].sort((a, b) => b.price - a.price).slice(0, 8);
  // New arrivals = take from end of array (last added)
  const newArrivals = [...products].reverse().slice(0, 8);

  const displayed = activeTab === 'best-sellers' ? bestSellers : newArrivals;

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-medium mb-6">You are in</h2>
          <div className="flex gap-8 md:gap-12 text-sm md:text-base font-medium uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('best-sellers')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'best-sellers'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground-secondary hover:text-foreground'
              }`}
            >
              best sellers
            </button>
            <button
              onClick={() => setActiveTab('new-arrivals')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'new-arrivals'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground-secondary hover:text-foreground'
              }`}
            >
              new arrivals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayed.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/collections/all-products"
            className="btn btn-outline"
          >
            Shop All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
