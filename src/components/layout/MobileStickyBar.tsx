import { Link, useLocation } from 'react-router';
import { Home, LayoutGrid, ShoppingBag, Search, User } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';

export default function MobileStickyBar() {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const { openSearch } = useUIStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border md:hidden">
      <div className="flex items-center justify-around h-14">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] flex-1 h-full ${
            isActive('/') ? 'text-primary' : 'text-foreground-secondary'
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={1.5} />
          <span>Home</span>
        </Link>

        <Link
          to="/collections"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] flex-1 h-full ${
            isActive('/collections') ? 'text-primary' : 'text-foreground-secondary'
          }`}
        >
          <LayoutGrid className="w-5 h-5" strokeWidth={1.5} />
          <span>Collection</span>
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] flex-1 h-full relative ${
            isActive('/cart') ? 'text-primary' : 'text-foreground-secondary'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>

        <button
          onClick={openSearch}
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] flex-1 h-full text-foreground-secondary"
        >
          <Search className="w-5 h-5" strokeWidth={1.5} />
          <span>Search</span>
        </button>

        <Link
          to="/account"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] flex-1 h-full ${
            isActive('/account') ? 'text-primary' : 'text-foreground-secondary'
          }`}
        >
          <User className="w-5 h-5" strokeWidth={1.5} />
          <span>Account</span>
        </Link>
      </div>
    </div>
  );
}
