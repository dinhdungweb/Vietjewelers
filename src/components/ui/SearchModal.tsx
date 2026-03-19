import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types/product';
import PriceDisplay from './PriceDisplay';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchFn: (query: string, limit?: number) => Product[];
}

export default function SearchModal({ isOpen, onClose, searchFn }: SearchModalProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      setResults(searchFn(q, 10));
    } else {
      setResults([]);
    }
  }, [searchFn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleResultClick = (handle: string) => {
    navigate(`/products/${handle}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-6 pt-24">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-8 h-8" />
        </button>

        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-12 pr-4 py-4 text-lg border-b-2 border-slate-200 dark:border-slate-700 bg-transparent focus:border-primary outline-none transition-colors"
          />
        </form>

        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="text-center text-slate-500 py-8">{t('search.noResults')}</p>
          )}
          {results.map(product => (
            <button
              key={product.handle}
              onClick={() => handleResultClick(product.handle)}
              className="w-full flex items-center gap-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <img
                src={product.primaryImage}
                alt={product.title}
                className="w-16 h-16 object-contain bg-white dark:bg-slate-800 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold uppercase tracking-tight truncate">{product.title}</h4>
                <PriceDisplay price={product.price} className="text-sm mt-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
