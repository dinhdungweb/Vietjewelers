import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileStickyBar from './components/layout/MobileStickyBar';
import FloatingChat from './components/layout/FloatingChat';
import CartDrawer from './components/ui/CartDrawer';
import SearchOverlay from './components/ui/SearchOverlay';
import QuickViewModal from './components/ui/QuickViewModal';
import { useProducts } from './hooks/useProducts';
import { useSearch } from './hooks/useSearch';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const ToothCharmPage = lazy(() => import('./pages/ToothCharmPage'));
const MadeToOrderPage = lazy(() => import('./pages/MadeToOrderPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));

export default function App() {
  const { products } = useProducts();
  const searchFn = useSearch(products);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/all-products" element={<ProductListingPage />} />
            <Route path="/collections/:handle" element={<CollectionDetailPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/products/:handle" element={<ProductDetailPage />} />
            <Route path="/pages/about" element={<AboutPage />} />
            <Route path="/pages/contact" element={<ContactPage />} />
            <Route path="/pages/tooth-charm" element={<ToothCharmPage />} />
            <Route path="/pages/made-to-order" element={<MadeToOrderPage />} />
            <Route path="/pages/wishlist" element={<WishlistPage />} />
            <Route path="/blogs/news/:handle" element={<BlogPostPage />} />
            <Route path="/blogs/news" element={<BlogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            {/* Legacy routes */}
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <MobileStickyBar />
      <FloatingChat />
      <CartDrawer />
      <SearchOverlay searchFn={searchFn} />
      <QuickViewModal products={products} />
    </div>
  );
}
