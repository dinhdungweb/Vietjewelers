import { useTranslation } from 'react-i18next';
import { X, SlidersHorizontal } from 'lucide-react';
import type { Category } from '../../types/product';

interface FilterSidebarProps {
  categories: Category[];
  productTypes: { type: string; count: number }[];
  selectedCategory: string;
  selectedType: string;
  selectedPriceRange: string;
  sortBy: string;
  onCategoryChange: (cat: string) => void;
  onTypeChange: (type: string) => void;
  onPriceRangeChange: (range: string) => void;
  onSortChange: (sort: string) => void;
  onClearAll: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const PRICE_RANGES = [
  { key: 'under500k', min: 0, max: 500000 },
  { key: '500kTo1m', min: 500000, max: 1000000 },
  { key: '1mTo5m', min: 1000000, max: 5000000 },
  { key: 'over5m', min: 5000000, max: Infinity },
];

export default function FilterSidebar({
  categories, productTypes, selectedCategory, selectedType, selectedPriceRange,
  sortBy, onCategoryChange, onTypeChange, onPriceRangeChange, onSortChange,
  onClearAll, mobileOpen, onMobileClose,
}: FilterSidebarProps) {
  const { t } = useTranslation();
  const hasFilters = selectedCategory || selectedType || selectedPriceRange;

  const content = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-slate-900 dark:text-white">{t('products.sort')}</h4>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm rounded"
        >
          <option value="price-desc">{t('products.sortPriceDesc')}</option>
          <option value="price-asc">{t('products.sortPriceAsc')}</option>
          <option value="name-asc">{t('products.sortNameAsc')}</option>
          <option value="name-desc">{t('products.sortNameDesc')}</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-slate-900 dark:text-white">{t('products.category')}</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.slug} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.slug}
                onChange={() => onCategoryChange(selectedCategory === cat.slug ? '' : cat.slug)}
                className="accent-primary"
              />
              <span>{cat.label}</span>
              <span className="text-slate-400 ml-auto">({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type */}
      {productTypes.length > 0 && (
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-slate-900 dark:text-white">{t('products.type')}</h4>
          <div className="space-y-2">
            {productTypes.map(pt => (
              <label key={pt.type} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                <input
                  type="radio"
                  name="type"
                  checked={selectedType === pt.type}
                  onChange={() => onTypeChange(selectedType === pt.type ? '' : pt.type)}
                  className="accent-primary"
                />
                <span>{pt.type}</span>
                <span className="text-slate-400 ml-auto">({pt.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-slate-900 dark:text-white">{t('products.priceRange')}</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map(range => (
            <label key={range.key} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range.key}
                onChange={() => onPriceRangeChange(selectedPriceRange === range.key ? '' : range.key)}
                className="accent-primary"
              />
              <span>{t(`products.${range.key}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClearAll}
          className="w-full py-2 text-sm font-semibold uppercase tracking-widest border border-slate-300 dark:border-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
        >
          {t('products.clearAll')}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        {content}
      </aside>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> {t('products.filters')}
              </h3>
              <button onClick={onMobileClose}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export { PRICE_RANGES };
