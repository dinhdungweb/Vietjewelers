import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAdminStore } from '../../stores/adminStore';
import { useProducts } from '../../hooks/useProducts';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import ProductManager from './ProductManager';
import BlogManager from './BlogManager';
import CollectionManager from './CollectionManager';
import TestimonialManager from './TestimonialManager';
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  ExternalLink,
  Layers,
  MessageSquare,
} from 'lucide-react';

type Tab = 'dashboard' | 'products' | 'blog' | 'collections' | 'testimonials';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const login = useAdminStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const ok = await login(username, password);
    if (!ok) setError('Sai thong tin dang nhap / Invalid credentials');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1e1e2d]">VietJewelers</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ten dang nhap / Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            placeholder="admin"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-[#795F06]/40 focus:border-[#795F06] transition-all"
            autoFocus
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mat khau / Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-1 focus:outline-none focus:ring-2 focus:ring-[#795F06]/40 focus:border-[#795F06] transition-all"
          />
          {error && <p className="text-red-500 text-xs mt-1 mb-3">{error}</p>}
          {!error && <div className="mb-3" />}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#795F06] text-white rounded-xl font-medium hover:bg-[#5a4704] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Dang nhap...' : 'Dang nhap'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const { products } = useProducts();
  const { posts } = useBlogPosts();

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#1e1e2d] mb-8">
        Tong quan / Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Tong san pham</span>
          </div>
          <p className="text-3xl font-bold text-[#1e1e2d]">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Blog posts</span>
          </div>
          <p className="text-3xl font-bold text-[#1e1e2d]">{posts.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Database</span>
          </div>
          <p className="text-sm text-green-600 font-medium mt-2">SQLite connected</p>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Tong quan', icon: LayoutDashboard },
  { id: 'products', label: 'San pham', icon: Package },
  { id: 'collections', label: 'Bo suu tap', icon: Layers },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'testimonials', label: 'Danh gia', icon: MessageSquare },
];

export default function AdminPage() {
  const isAuth = useAdminStore((s) => s.isAuthenticated);
  const logout = useAdminStore((s) => s.logout);
  const checkAuth = useAdminStore((s) => s.checkAuth);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuth) return <LoginForm />;

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e1e2d] text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-lg font-bold tracking-wide">VJ Admin</h1>
          <p className="text-xs text-gray-400 mt-0.5">Quan ly cua hang</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === id
                  ? 'bg-[#795F06] text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 space-y-1 border-t border-white/10">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ve trang chu
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Dang xuat
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'collections' && <CollectionManager />}
        {activeTab === 'blog' && <BlogManager />}
        {activeTab === 'testimonials' && <TestimonialManager />}
      </main>
    </div>
  );
}
