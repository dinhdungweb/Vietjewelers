import { Link } from 'react-router';
import { useWishlistStore } from '../stores/wishlistStore';
import ProductCard from '../components/ui/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Wishlist</span>
        </div>
        <h1>Wishlist</h1>
      </div>

      <div className="container section-spacing pb-20">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary mb-6">Your wishlist is empty</p>
            <Link to="/collections/all-products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
