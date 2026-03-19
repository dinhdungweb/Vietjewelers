import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useProducts } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import ProductCard from '../components/ui/ProductCard';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useProducts();
  const searchFn = useSearch(products);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchFn(query, 50);
  }, [query, searchFn]);

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Search</span>
        </div>
        <h1>Search Results</h1>
        {query && (
          <p className="text-foreground-secondary text-sm mt-2">
            {results.length} results for "{query}"
          </p>
        )}
      </div>

      <div className="container section-spacing pb-20">
        {results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary mb-6">
              {query ? `No results found for "${query}"` : 'Enter a search term to find products'}
            </p>
            <Link to="/collections/all-products" className="btn btn-primary">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {results.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
