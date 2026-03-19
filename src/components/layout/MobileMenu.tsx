import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { X, ChevronDown, Search, User, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';

const SHOP_MENU = [
  {
    label: 'Earrings',
    slug: 'earrings',
    children: [
      { label: 'Ear cuff', slug: 'ear-cuff' },
      { label: 'Ear stud', slug: 'ear-stud' },
      { label: 'Hoopie', slug: 'ear-hoop' },
      { label: 'Hookie', slug: 'ear-hook' },
    ],
  },
  {
    label: 'Necklace',
    slug: 'pendants',
    children: [
      { label: 'Silver necklace', slug: 'silver-necklace' },
      { label: 'Gold plate silver necklace', slug: 'gold-plate-silver-necklace' },
      { label: 'Chain', slug: 'chain' },
      { label: 'Pendant', slug: 'pendant' },
    ],
  },
  {
    label: 'Bracelets',
    slug: 'bracelets',
    children: [
      { label: 'Chain bracelet', slug: 'chain-bracelet' },
      { label: 'Bangle', slug: 'bangle' },
      { label: 'Anklet', slug: 'anklet' },
    ],
  },
  {
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
  {
    label: 'Nose ring',
    slug: 'nose-ring',
    children: [
      { label: 'Nostril', slug: 'nostril' },
      { label: 'Septum', slug: 'septum' },
    ],
  },
  { label: 'Brooch', slug: 'brooch', children: [] },
  { label: 'Grillz', slug: 'grillz', children: [] },
];

const COLLECTION_ITEMS = [
  { label: 'Silver Letter Pendant', slug: 'silver-letter-pendant' },
  { label: "Men's Collection", slug: 'men-collection' },
  { label: 'Garnet Collection', slug: 'garnet-collection' },
  { label: 'Vintage Watch Collection', slug: 'vintage-watch' },
];

const SERVICE_ITEMS = [
  { label: 'TOOTH CHARM', to: '/pages/tooth-charm' },
  { label: 'JEWEL YOUR SMILE - GRILLZ', to: '/blogs/news/jewel-your-smile' },
  { label: 'MADE TO ORDER', to: '/pages/made-to-order' },
  { label: 'ORDER PROCESSING TIME & NOTE FOR TRAVELER', to: '/blogs/news/order-processing-time-note-for-traveler' },
];

export default function MobileMenu() {
  const { i18n } = useTranslation();
  const { mobileMenuOpen, closeMobileMenu, openSearch } = useUIStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isExpanded = (key: string) => expandedSections.has(key);

  const handleNavClick = () => {
    closeMobileMenu();
    setExpandedSections(new Set());
  };

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <>
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-[70] transform transition-transform duration-300 lg:hidden overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/" onClick={handleNavClick}>
            <img
              src="https://vietjewelers.com/cdn/shop/files/Logo_Ch.png?v=1740834295"
              alt="Viet Jewelers"
              className="h-8"
            />
          </Link>
          <button onClick={closeMobileMenu} className="text-foreground hover:text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-border text-foreground-secondary">
          <button
            onClick={() => { closeMobileMenu(); openSearch(); }}
            className="flex items-center gap-2 text-sm hover:text-primary"
          >
            <Search className="w-4 h-4" /> Search
          </button>
          <Link to="/account" onClick={handleNavClick} className="flex items-center gap-2 text-sm hover:text-primary">
            <User className="w-4 h-4" /> Account
          </Link>
          <Link to="/pages/wishlist" onClick={handleNavClick} className="flex items-center gap-2 text-sm hover:text-primary">
            <Heart className="w-4 h-4" /> Wishlist
          </Link>
        </div>

        {/* Navigation */}
        <nav className="py-2">
          {/* Home */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="block px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground hover:text-primary border-b border-border"
          >
            Home
          </Link>

          {/* About */}
          <Link
            to="/pages/about"
            onClick={handleNavClick}
            className="block px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground hover:text-primary border-b border-border"
          >
            About
          </Link>

          {/* Shop (accordion) */}
          <div className="border-b border-border">
            <div className="flex items-center justify-between">
              <Link
                to="/collections/all-products"
                onClick={handleNavClick}
                className="flex-1 px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground hover:text-primary"
              >
                Shop
              </Link>
              <button
                onClick={() => toggleSection('shop')}
                className="px-4 py-3 text-foreground-secondary"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded('shop') ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isExpanded('shop') && (
              <div className="pb-2">
                {SHOP_MENU.map((cat) => (
                  <div key={cat.slug}>
                    {cat.children.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/collections/${cat.slug}`}
                            onClick={handleNavClick}
                            className="flex-1 pl-8 pr-4 py-2 text-[13px] font-medium text-foreground hover:text-primary"
                          >
                            {cat.label}
                          </Link>
                          <button
                            onClick={() => toggleSection(cat.slug)}
                            className="px-4 py-2 text-foreground-secondary"
                          >
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded(cat.slug) ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        {isExpanded(cat.slug) && (
                          <div>
                            {cat.children.map((child) => (
                              <Link
                                key={child.slug}
                                to={`/collections/${child.slug}`}
                                onClick={handleNavClick}
                                className="block pl-12 pr-4 py-1.5 text-[12px] text-foreground-secondary hover:text-primary"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={`/collections/${cat.slug}`}
                        onClick={handleNavClick}
                        className="block pl-8 pr-4 py-2 text-[13px] font-medium text-foreground hover:text-primary"
                      >
                        {cat.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collection (accordion) */}
          <div className="border-b border-border">
            <div className="flex items-center justify-between">
              <Link
                to="/collections"
                onClick={handleNavClick}
                className="flex-1 px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground hover:text-primary"
              >
                Collection
              </Link>
              <button
                onClick={() => toggleSection('collection')}
                className="px-4 py-3 text-foreground-secondary"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded('collection') ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {isExpanded('collection') && (
              <div className="pb-2">
                {COLLECTION_ITEMS.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/collections/${item.slug}`}
                    onClick={handleNavClick}
                    className="block pl-8 pr-4 py-2 text-[13px] text-foreground-secondary hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Blog */}
          <Link
            to="/blogs/news"
            onClick={handleNavClick}
            className="block px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground hover:text-primary border-b border-border"
          >
            Blog
          </Link>

          {/* Contact */}
          <Link
            to="/pages/contact"
            onClick={handleNavClick}
            className="block px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground hover:text-primary border-b border-border"
          >
            Contact
          </Link>

          {/* Service (accordion) */}
          <div className="border-b border-border">
            <div className="flex items-center justify-between">
              <span className="px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground">
                Service
              </span>
              <button
                onClick={() => toggleSection('service')}
                className="px-4 py-3 text-foreground-secondary"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded('service') ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {isExpanded('service') && (
              <div className="pb-2">
                {SERVICE_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className="block pl-8 pr-4 py-2 text-[13px] text-foreground-secondary hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border mt-4">
          <button
            onClick={toggleLang}
            className="w-full text-sm font-medium border border-border px-4 py-2.5 rounded hover:bg-foreground hover:text-white hover:border-foreground transition-colors"
          >
            {i18n.language === 'en' ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
          </button>
        </div>
      </div>
    </>
  );
}
