import { useParams, Navigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useProducts, filterProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import Pagination from '../components/ui/Pagination';

const ITEMS_PER_PAGE = 24;

export default function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { products, categories, loading } = useProducts();
  const [sortBy, setSortBy] = useState('price-desc');
  const [currentPage, setCurrentPage] = useState(1);

  const category = categories.find(c => c.slug === slug);

  const filtered = useMemo(() => {
    return filterProducts(products, { category: slug, sort: sortBy });
  }, [products, slug, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 animate-pulse">{t('common.loading')}</p>
      </div>
    );
  }

  if (!category) {
    return <Navigate to="/products" replace />;
  }

  const categoryLabel = t(`categories.${slug}`, category.label);

  return (
    <>
      <Helmet>
        <title>{categoryLabel} | Viet Jewelers</title>
        <meta name="description" content={`Explore our ${category.label} collection. Handcrafted jewelry by Viet Jewelers.`} />
        <link rel="canonical" href={`https://vietjewelers.com/category/${slug}`} />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb items={[
          { label: t('common.home'), to: '/' },
          { label: categoryLabel },
        ]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{categoryLabel}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('products.showingResults', { count: filtered.length })}
            </p>
          </div>
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm rounded"
          >
            <option value="price-desc">{t('products.sortPriceDesc')}</option>
            <option value="price-asc">{t('products.sortPriceAsc')}</option>
            <option value="name-asc">{t('products.sortNameAsc')}</option>
          </select>
        </div>

        {paginated.length === 0 ? (
          <p className="text-center text-slate-500 py-16">{t('products.noProducts')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginated.map(product => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
