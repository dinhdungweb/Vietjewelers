import { Link } from 'react-router';
import { useProducts } from '../hooks/useProducts';

export default function CollectionsPage() {
  const { collections, loading } = useProducts();

  if (loading) return null;

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Collections</span>
        </div>
        <h1>Collections</h1>
      </div>

      <div className="container section-spacing pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.handle}
              to={`/collections/${col.handle}`}
              className="group"
            >
              <div className="aspect-square bg-background-secondary rounded overflow-hidden mb-3">
                {col.image ? (
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-secondary text-sm">
                    {col.title}
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                {col.title}
              </h3>
              <p className="text-xs text-foreground-secondary text-center mt-1">
                {col.productCount} products
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
