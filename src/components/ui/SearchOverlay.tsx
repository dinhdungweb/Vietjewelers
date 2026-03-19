import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';

const POPULAR_SEARCHES = ['Ring', 'Bracelet', 'Chain', 'Pendant', 'Earring'];

interface SearchOverlayProps {
  searchFn: (query: string, limit?: number) => Product[];
}

export default function SearchOverlay({ searchFn }: SearchOverlayProps) {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) closeSearch();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [searchOpen, closeSearch]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      setResults(searchFn(q, 8));
    } else {
      setResults([]);
    }
  }, [searchFn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const handleResultClick = (handle: string) => {
    navigate(`/products/${handle}`);
    closeSearch();
  };

  const handlePopularClick = (term: string) => {
    handleSearch(term);
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link to="/" onClick={closeSearch}>
            <img
              src="https://vietjewelers.com/cdn/shop/files/Logo_Ch.png?v=1740834295"
              alt="Viet Jewelers"
              className="h-10"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/account" onClick={closeSearch} className="text-sm text-foreground-secondary hover:text-primary transition-colors hidden md:inline">Account</Link>
            <Link to="/pages/wishlist" onClick={closeSearch} className="text-sm text-foreground-secondary hover:text-primary transition-colors hidden md:inline">Wishlist</Link>
            <Link to="/cart" onClick={closeSearch} className="text-sm text-foreground-secondary hover:text-primary transition-colors hidden md:inline">Cart</Link>
            <button
              onClick={closeSearch}
              className="text-foreground hover:text-primary transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search our store"
            className="w-full pl-8 pr-4 py-4 text-lg border-b-2 border-border bg-transparent focus:border-foreground outline-none transition-colors"
          />
        </form>

        {/* Popular searches */}
        {query.trim().length < 2 && (
          <div className="mb-8">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-3">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularClick(term)}
                  className="px-4 py-2 border border-border rounded-full text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto">
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="text-center text-foreground-secondary py-8">
              No results found for "{query}"
            </p>
          )}
          {results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((product) => (
                <button
                  key={product.handle}
                  onClick={() => handleResultClick(product.handle)}
                  className="text-left group"
                >
                  <div className="aspect-square bg-background-secondary rounded overflow-hidden mb-2">
                    <img
                      src={product.primaryImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h4>
                  <p className="text-xs font-medium mt-1">{formatPrice(product.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
