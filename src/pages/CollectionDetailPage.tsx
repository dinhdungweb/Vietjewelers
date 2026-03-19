import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useProducts, filterProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';

export default function CollectionDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const { products, collections, loading } = useProducts();
  const [sort, setSort] = useState('');

  const collection = collections.find((c) => c.handle === handle);
  const title = collection?.title || handle?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Collection';

  const filtered = useMemo(() => {
    const result = products.filter((p) => p.collections.includes(handle || ''));
    return filterProducts(result, { sort });
  }, [products, handle, sort]);

  if (loading) return null;

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/collections">Collections</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        <p className="text-foreground-secondary text-sm mt-2">{filtered.length} products</p>
      </div>

      <div className="container py-8 lg:py-12">
        {/* Sort */}
        <div className="flex items-center justify-end mb-8">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-border px-3 py-2 text-sm rounded focus:outline-none focus:border-foreground"
          >
            <option value="">Featured</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="name-asc">Alphabetically, A-Z</option>
            <option value="name-desc">Alphabetically, Z-A</option>
            <option value="date-new">Date, new to old</option>
            <option value="date-old">Date, old to new</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-foreground-secondary py-12">No products found in this collection.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
