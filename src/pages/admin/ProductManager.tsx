import { useState, useCallback } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { apiPut, apiDelete, apiPost } from '../../lib/api';
import type { Product } from '../../types/product';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Upload,
  Eye,
} from 'lucide-react';

function generateHandle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

interface ProductForm {
  handle: string;
  title: string;
  description: string;
  categorySlug: string;
  categoryLabel: string;
  type: string;
  price: string;
  compareAtPrice: string;
  seoTitle: string;
  seoDescription: string;
  availability: 'in_stock' | 'out_of_stock';
  tags: string;
  variants: { title: string; price: string; available: boolean }[];
  collections: string[];
  images: string[];
}

const emptyForm: ProductForm = {
  handle: '', title: '', description: '', categorySlug: '', categoryLabel: '',
  type: '', price: '', compareAtPrice: '', seoTitle: '', seoDescription: '',
  availability: 'in_stock', tags: '', variants: [], collections: [], images: [],
};

function productToForm(p: Product): ProductForm {
  return {
    handle: p.handle,
    title: p.title,
    description: p.description,
    categorySlug: p.category,
    categoryLabel: p.categoryLabel,
    type: p.type,
    price: String(p.price),
    compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    availability: p.availability,
    tags: p.tags.join(', '),
    variants: p.variants.map(v => ({ title: v.title, price: String(v.price), available: v.available })),
    collections: p.collections,
    images: p.images,
  };
}

export default function ProductManager() {
  const { products, categories, collections, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.handle.toLowerCase().includes(search.toLowerCase())
  );

  const startCreate = () => {
    setForm({ ...emptyForm });
    setIsNew(true);
    setMode('edit');
    setError('');
  };

  const startEdit = (product: Product) => {
    setForm(productToForm(product));
    setIsNew(false);
    setMode('edit');
    setError('');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.categorySlug || !form.price) {
      setError('Vui long nhap tieu de, danh muc va gia');
      return;
    }
    setSaving(true);
    setError('');

    const handle = form.handle || generateHandle(form.title);
    const payload = {
      handle,
      title: form.title,
      description: form.description,
      categorySlug: form.categorySlug,
      categoryLabel: form.categoryLabel,
      type: form.type,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      availability: form.availability,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      variants: form.variants.map(v => ({ title: v.title, price: Number(v.price), available: v.available })),
      collections: form.collections,
      images: form.images,
    };

    try {
      if (isNew) {
        await apiPost('/admin/products', payload);
      } else {
        await apiPut(`/admin/products/${form.handle}`, payload);
      }
      setMode('list');
      // Invalidate cache
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Loi khi luu san pham');
    }
    setSaving(false);
  };

  const handleDelete = async (handle: string) => {
    try {
      await apiDelete(`/admin/products/${handle}`);
      setDeleteConfirm(null);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Loi khi xoa');
    }
  };

  const handleImageUpload = useCallback(async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
        }
      } catch {
        alert('Loi upload anh');
      }
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-[#795F06] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (mode === 'edit') {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMode('list')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <h2 className="text-2xl font-bold text-[#1e1e2d]">{isNew ? 'Them san pham moi' : 'Chinh sua san pham'}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Huy</button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-[#795F06] text-white rounded-xl text-sm font-medium hover:bg-[#5a4704] disabled:opacity-50">
              <Save className="w-4 h-4" />{saving ? 'Dang luu...' : 'Luu'}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tieu de *</label>
                <input type="text" value={form.title} onChange={e => { setForm(prev => ({ ...prev, title: e.target.value, ...(isNew ? { handle: generateHandle(e.target.value) } : {}) })); }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" placeholder="Ten san pham" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Handle</label>
                <input type="text" value={form.handle} onChange={e => setForm(prev => ({ ...prev, handle: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" disabled={!isNew} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mo ta (HTML)</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#795F06]/40 resize-y" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gia (VND) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gia goc (VND)</label>
                  <input type="number" value={form.compareAtPrice} onChange={e => setForm(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (phan cach dau phay)</label>
                <input type="text" value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" placeholder="handmade, silver ring, ..." />
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-semibold text-sm">SEO</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input type="text" value={form.seoTitle} onChange={e => setForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea value={form.seoDescription} onChange={e => setForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                  rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40 resize-none" />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-semibold text-sm">Anh san pham ({form.images.length})</h3>
              <div className="grid grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-full aspect-square object-cover rounded-xl bg-gray-50" referrerPolicy="no-referrer" />
                    <button onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-[#795F06] text-white px-1.5 py-0.5 rounded">Chinh</span>}
                  </div>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e1e2d] text-white rounded-lg text-sm cursor-pointer hover:bg-[#2d2d40]">
                <Upload className="w-3.5 h-3.5" /> Upload anh
                <input type="file" multiple accept="image/*" onChange={e => e.target.files && handleImageUpload(e.target.files)} className="hidden" />
              </label>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh muc *</label>
                <select value={form.categorySlug} onChange={e => { const cat = categories.find(c => c.slug === e.target.value); setForm(prev => ({ ...prev, categorySlug: e.target.value, categoryLabel: cat?.label || '' })); }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40">
                  <option value="">-- Chon --</option>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.label} ({c.count})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loai (Type)</label>
                <input type="text" value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" placeholder="Silver ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tinh trang</label>
                <select value={form.availability} onChange={e => setForm(prev => ({ ...prev, availability: e.target.value as any }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40">
                  <option value="in_stock">Con hang</option>
                  <option value="out_of_stock">Het hang</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bo suu tap</label>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {collections.map(c => (
                  <label key={c.handle} className="flex items-center gap-2 text-sm py-1">
                    <input type="checkbox" checked={form.collections.includes(c.handle)}
                      onChange={e => {
                        if (e.target.checked) setForm(prev => ({ ...prev, collections: [...prev.collections, c.handle] }));
                        else setForm(prev => ({ ...prev, collections: prev.collections.filter(h => h !== c.handle) }));
                      }}
                      className="rounded border-gray-300 text-[#795F06] focus:ring-[#795F06]" />
                    {c.title}
                  </label>
                ))}
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Bien the</label>
                <button onClick={() => setForm(prev => ({ ...prev, variants: [...prev.variants, { title: '', price: form.price, available: true }] }))}
                  className="text-xs text-[#795F06] hover:underline">+ Them</button>
              </div>
              {form.variants.map((v, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input type="text" value={v.title} placeholder="Ten" onChange={e => {
                    const vars = [...form.variants]; vars[i] = { ...vars[i], title: e.target.value }; setForm(prev => ({ ...prev, variants: vars }));
                  }} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                  <input type="number" value={v.price} placeholder="Gia" onChange={e => {
                    const vars = [...form.variants]; vars[i] = { ...vars[i], price: e.target.value }; setForm(prev => ({ ...prev, variants: vars }));
                  }} className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                  <button onClick={() => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }))}
                    className="p-1 hover:bg-red-50 text-red-500 rounded"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e1e2d]">Quan ly san pham ({products.length})</h2>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#795F06] text-white rounded-xl text-sm font-medium hover:bg-[#5a4704]">
          <Plus className="w-4 h-4" /> Them san pham
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tim san pham..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">San pham</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Danh muc</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Gia</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Trang thai</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map(p => (
              <tr key={p.handle} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.primaryImage} alt="" className="w-10 h-10 object-cover rounded-lg bg-gray-100" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[250px]">{p.title}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[250px]">{p.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">{p.categoryLabel}</td>
                <td className="px-6 py-3 text-sm text-right font-medium">{p.price.toLocaleString()} VND</td>
                <td className="px-6 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    p.availability === 'in_stock' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>{p.availability === 'in_stock' ? 'Con hang' : 'Het hang'}</span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-1 justify-end">
                    <a href={`/products/${p.handle}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg" title="Xem">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </a>
                    <button onClick={() => startEdit(p)} className="p-2 hover:bg-gray-100 rounded-lg" title="Sua">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => setDeleteConfirm(p.handle)} className="p-2 hover:bg-red-50 rounded-lg" title="Xoa">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 100 && <p className="text-center text-gray-400 py-4 text-sm">Hien thi 100 / {filtered.length} san pham. Dung o tim kiem de loc.</p>}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-lg mb-2">Xac nhan xoa</h3>
            <p className="text-sm text-gray-500 mb-6">Ban co chac muon xoa san pham nay?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Huy</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">Xoa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
