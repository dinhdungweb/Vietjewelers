import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../lib/api';
import type { Testimonial } from '../../types/product';
import { Plus, Edit, Trash2, Save, X, Star } from 'lucide-react';

interface TestimonialWithId extends Testimonial {
  id?: number;
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<TestimonialWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TestimonialWithId | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const data = await apiGet<TestimonialWithId[]>('/testimonials');
      setTestimonials(data);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const startCreate = () => {
    setEditing({ name: '', title: '', text: '', image: '' });
    setIsNew(true);
  };

  const startEdit = (t: TestimonialWithId) => {
    setEditing({ ...t });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing || !editing.name.trim() || !editing.text.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await apiPost('/admin/testimonials', editing);
      } else if (editing.id) {
        await apiPut(`/admin/testimonials/${editing.id}`, editing);
      }
      setEditing(null);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDelete(`/admin/testimonials/${id}`);
      setDeleteConfirm(null);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-[#795F06] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e1e2d]">Quan ly danh gia ({testimonials.length})</h2>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#795F06] text-white rounded-xl text-sm font-medium hover:bg-[#5a4704]">
          <Plus className="w-4 h-4" /> Them danh gia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {t.image && <img src={t.image} alt="" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />}
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  {t.title && <p className="text-xs text-gray-400">{t.title}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(t)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                <button onClick={() => setDeleteConfirm((t as any).id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-black text-black" />)}</div>
            <p className="text-sm text-gray-600 line-clamp-3">{t.text}</p>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">{isNew ? 'Them danh gia' : 'Chinh sua danh gia'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ten *</label>
                <input type="text" value={editing.name} onChange={e => setEditing(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tieu de</label>
                <input type="text" value={editing.title} onChange={e => setEditing(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Love it so much" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Noi dung *</label>
                <textarea value={editing.text} onChange={e => setEditing(prev => prev ? { ...prev, text: e.target.value } : null)}
                  rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL anh</label>
                <input type="text" value={editing.image} onChange={e => setEditing(prev => prev ? { ...prev, image: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Huy</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#795F06] text-white rounded-lg text-sm hover:bg-[#5a4704] disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Dang luu...' : 'Luu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-lg mb-2">Xac nhan xoa</h3>
            <p className="text-sm text-gray-500 mb-6">Xoa danh gia nay?</p>
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
