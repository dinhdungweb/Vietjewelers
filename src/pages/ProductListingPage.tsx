import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, X } from 'lucide-react';
import { useProducts, filterProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';

const ITEMS_PER_PAGE = 24;

export default function ProductListingPage() {
  const { products, categories, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || '';
  const availability = searchParams.get('availability') || '';
  const searchQuery = searchParams.get('q') || '';

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    }
    setSearchParams(newParams);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const filtered = useMemo(() => {
    let result = filterProducts(products, {
      category: selectedCategory,
      sort: sortBy,
      availability: availability as 'in_stock' | 'out_of_stock' | undefined || undefined,
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, selectedCategory, sortBy, availability, searchQuery]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  if (loading) return null;

  return (
    <>
      <Helmet>
        <title>All Products | VIETJEWELERS</title>
        <meta name="description" content="Browse our complete collection of handcrafted gold and silver jewelry." />
      </Helmet>

      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>All Products</span>
        </div>
        <h1>All Products</h1>
      </div>

      <div className="container py-8 lg:py-12 pb-20">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium border border-border px-3 py-2 rounded hover:border-foreground transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>
            <span className="text-sm text-foreground-secondary">
              {filtered.length} products
            </span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => updateParams({ sort: e.target.value })}
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

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className={`${mobileFilterOpen ? 'fixed inset-0 z-[60] bg-white p-6 overflow-y-auto' : 'hidden'} lg:block lg:relative lg:w-56 flex-shrink-0`}>
            {mobileFilterOpen && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-base font-semibold uppercase">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Availability */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Availability</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === ''}
                    onChange={() => updateParams({ availability: '' })}
                    className="accent-primary"
                  />
                  All
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === 'in_stock'}
                    onChange={() => updateParams({ availability: 'in_stock' })}
                    className="accent-primary"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === 'out_of_stock'}
                    onChange={() => updateParams({ availability: 'out_of_stock' })}
                    className="accent-primary"
                  />
                  Out of Stock
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Category</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => updateParams({ category: '' })}
                    className="accent-primary"
                  />
                  All Categories
                </label>
                {categories.map((cat) => (
                  <label key={cat.slug} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => updateParams({ category: cat.slug })}
                      className="accent-primary"
                    />
                    {cat.label} ({cat.count})
                  </label>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn btn-primary w-full mt-4 lg:hidden"
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {displayed.length === 0 ? (
              <p className="text-center text-foreground-secondary py-16">No products found</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {displayed.map((product) => (
                    <ProductCard key={product.handle} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                      className="btn btn-outline"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
