import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import MobileMenu from './MobileMenu';

const MEGA_MENU = {
  earrings: {
    label: 'Earrings',
    slug: 'earrings',
    children: [
      { label: 'Ear cuff', slug: 'ear-cuff' },
      { label: 'Ear stud', slug: 'ear-stud' },
      { label: 'Hoopie', slug: 'ear-hoop' },
      { label: 'Hookie', slug: 'ear-hook' },
    ],
  },
  necklace: {
    label: 'Necklace',
    slug: 'pendants',
    children: [
      { label: 'Silver necklace', slug: 'silver-necklace' },
      { label: 'Gold plate silver necklace', slug: 'gold-plate-silver-necklace' },
      { label: 'Chain', slug: 'chain' },
      { label: 'Pendant', slug: 'pendant' },
    ],
  },
  bracelets: {
    label: 'Bracelets',
    slug: 'bracelets',
    children: [
      { label: 'Chain bracelet', slug: 'chain-bracelet' },
      { label: 'Bangle', slug: 'bangle' },
      { label: 'Anklet', slug: 'anklet' },
    ],
  },
  rings: {
    label: 'Rings',
    slug: 'rings',
    children: [
      { label: 'Silver ring', slug: 'silver-ring' },
      { label: 'Gold plate silver ring', slug: 'gold-plate-silver-ring' },
      { label: 'Toe ring', slug: 'toe-ring' },
      { label: 'Texture band ring', slug: 'texture-band-ring' },
      { label: 'Shaky ring', slug: 'shaky-rings' },
      { label: 'Stone ring', slug: 'stone-ring' },
    ],
  },
  noseRing: {
    label: 'Nose ring',
    slug: 'nose-ring',
    children: [
      { label: 'Nostril', slug: 'nostril' },
      { label: 'Septum', slug: 'septum' },
    ],
  },
  brooch: { label: 'Brooch', slug: 'brooch', children: [] },
  grillz: { label: 'Grillz', slug: 'grillz', children: [] },
};

const COLLECTION_DROPDOWN = [
  { label: 'Silver Letter Pendant', slug: 'silver-letter-pendant' },
  { label: "Men's Collection", slug: 'men-collection' },
  { label: 'Garnet Collection', slug: 'garnet-collection' },
  { label: 'Vintage Watch Collection', slug: 'vintage-watch' },
];

const SERVICE_DROPDOWN = [
  { label: 'TOOTH CHARM', to: '/pages/tooth-charm' },
  { label: 'JEWEL YOUR SMILE - GRILLZ', to: '/blogs/news/jewel-your-smile' },
  { label: 'MADE TO ORDER', to: '/pages/made-to-order' },
  { label: 'ORDER PROCESSING TIME & NOTE FOR TRAVELER', to: '/blogs/news/order-processing-time-note-for-traveler' },
];

// Live site logo URLs
const LOGO_DESKTOP = 'https://vietjewelers.com/cdn/shop/files/Logo_T_ng.png?v=1718962404&width=300';
const LOGO_MOBILE = 'https://vietjewelers.com/cdn/shop/files/Logo_Ch.png?v=1718962467&width=150';

export default function Header() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { openSearch, openMobileMenu } = useUIStore();
  const cartTotal = useCartStore((s) => s.totalItems());
  const wishlistTotal = useWishlistStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleDropdownEnter = (key: string) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Header */}
      <header
        className={`lg:hidden sticky top-0 z-50 bg-white border-b border-border transition-all duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container-fluid flex items-center justify-between py-3">
          {/* Left: Hamburger */}
          <div className="flex items-center flex-1">
            <button
              onClick={openMobileMenu}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="flex justify-center">
            <img
              src={LOGO_MOBILE}
              alt="VIETJEWELERS"
              className="h-4"
            />
          </Link>

          {/* Right: Search + Cart */}
          <div className="flex items-center justify-end flex-1 gap-3">
            <button
              onClick={openSearch}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={toggleCart}
              className="relative text-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartTotal > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className={`hidden lg:block sticky top-0 z-50 bg-white border-b border-border transition-all duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container-fluid">
          <div className="flex items-center py-2">
            {/* Left 5/12: Navigation */}
            <div className="w-5/12">
              <nav className="flex items-center gap-5 text-[13px] font-medium uppercase tracking-wide">
                <Link
                  to="/"
                  className={`py-3 hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : ''}`}
                >
                  Home
                </Link>
                <Link
                  to="/pages/about"
                  className={`py-3 hover:text-primary transition-colors ${isActive('/pages/about') ? 'text-primary' : ''}`}
                >
                  About
                </Link>

                {/* Shop mega menu */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('shop')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to="/collections/all-products"
                    className={`py-3 flex items-center gap-1 hover:text-primary transition-colors ${
                      isActive('/collections/all-products') ? 'text-primary' : ''
                    }`}
                  >
                    Shop <ChevronDown className="w-3 h-3" />
                  </Link>

                  {activeDropdown === 'shop' && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-white border border-border shadow-lg p-6 grid grid-cols-4 gap-x-8 gap-y-4" style={{ minWidth: 600 }}>
                        {Object.values(MEGA_MENU).map((cat) => (
                          <div key={cat.slug}>
                            <Link
                              to={`/collections/${cat.slug}`}
                              className="font-medium text-[13px] text-foreground hover:text-primary transition-colors block mb-2"
                            >
                              {cat.label}
                            </Link>
                            {cat.children.length > 0 && (
                              <ul className="space-y-1">
                                {cat.children.map((child) => (
                                  <li key={child.slug}>
                                    <Link
                                      to={`/collections/${child.slug}`}
                                      className="text-[12px] text-foreground-secondary hover:text-primary transition-colors"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Collection dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('collection')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to="/collections"
                    className="py-3 flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Collection <ChevronDown className="w-3 h-3" />
                  </Link>

                  {activeDropdown === 'collection' && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-white border border-border shadow-lg py-2 min-w-[220px]">
                        {COLLECTION_DROPDOWN.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/collections/${item.slug}`}
                            className="block px-4 py-2 text-[12px] text-foreground hover:text-primary hover:bg-background-secondary transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/blogs/news"
                  className={`py-3 hover:text-primary transition-colors ${isActive('/blogs') ? 'text-primary' : ''}`}
                >
                  Blog
                </Link>

                <Link
                  to="/pages/contact"
                  className={`py-3 hover:text-primary transition-colors ${isActive('/pages/contact') ? 'text-primary' : ''}`}
                >
                  Contact
                </Link>

                {/* Service dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('service')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to="/collections/service"
                    className="py-3 flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Service <ChevronDown className="w-3 h-3" />
                  </Link>

                  {activeDropdown === 'service' && (
                    <div className="absolute top-full right-0 pt-2 z-50">
                      <div className="bg-white border border-border shadow-lg py-2 min-w-[280px]">
                        {SERVICE_DROPDOWN.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block px-4 py-2 text-[12px] text-foreground hover:text-primary hover:bg-background-secondary transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Center 2/12: Logo */}
            <div className="w-2/12 flex justify-center">
              <Link to="/" title="VIETJEWELERS">
                <img
                  src={LOGO_DESKTOP}
                  alt="VIETJEWELERS"
                  style={{ height: scrolled ? '32px' : '40px' }}
                  className="transition-all duration-300 max-w-full"
                />
              </Link>
            </div>

            {/* Right 5/12: Actions */}
            <div className="w-5/12 flex items-center justify-end gap-4">
              {/* Language switcher */}
              <button
                onClick={toggleLang}
                className="text-[12px] font-medium hover:text-primary transition-colors"
              >
                {i18n.language === 'en' ? 'English' : 'Tiếng Việt'}
                <ChevronDown className="w-3 h-3 inline ml-0.5" />
              </button>

              <button
                onClick={openSearch}
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <Link
                to="/account"
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Account"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>

              <Link
                to="/pages/wishlist"
                className="relative text-foreground hover:text-primary transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
                {wishlistTotal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistTotal}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleCart}
                className="relative text-foreground hover:text-primary transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartTotal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartTotal}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}
