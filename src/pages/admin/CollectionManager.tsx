import { useState, useEffect, Fragment } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { apiPost, apiPut, apiDelete } from '../../lib/api';
import type { Collection } from '../../types/product';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function CollectionManager() {
  const { collections, loading } = useProducts();
  const [editingHandle, setEditingHandle] = useState<string | null>(null);
  const [form, setForm] = useState({ handle: '', title: '', image: '', parentHandle: '' });
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const startCreate = () => {
    setForm({ handle: '', title: '', image: '', parentHandle: '' });
    setIsNew(true);
    setEditingHandle('__new__');
  };

  const startEdit = (c: Collection) => {
    setForm({ handle: c.handle, title: c.title, image: c.image || '', parentHandle: c.parentHandle || '' });
    setIsNew(false);
    setEditingHandle(c.handle);
  };

  const handleSave = async () => {
    if (!form.handle || !form.title) return;
    setSaving(true);
    try {
      if (isNew) {
        await apiPost('/admin/collections', form);
      } else {
        await apiPut(`/admin/collections/${form.handle}`, form);
      }
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (handle: string) => {
    try {
      await apiDelete(`/admin/collections/${handle}`);
      setDeleteConfirm(null);
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-[#795F06] border-t-transparent rounded-full animate-spin" /></div>;

  // Group: parents first, then children under parents
  const parents = collections.filter(c => !c.parentHandle);
  const childrenOf = (handle: string) => collections.filter(c => c.parentHandle === handle);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e1e2d]">Quan ly bo suu tap ({collections.length})</h2>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#795F06] text-white rounded-xl text-sm font-medium hover:bg-[#5a4704]">
          <Plus className="w-4 h-4" /> Them moi
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Bo suu tap</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Handle</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">So san pham</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {parents.map(c => (
              <Fragment key={c.handle}>
                <CollectionRow collection={c} indent={0}
                  isEditing={editingHandle === c.handle} form={form} setForm={setForm}
                  saving={saving} onEdit={() => startEdit(c)} onSave={handleSave}
                  onCancel={() => setEditingHandle(null)} onDelete={() => setDeleteConfirm(c.handle)} />
                {childrenOf(c.handle).map(child => (
                  <CollectionRow key={child.handle} collection={child} indent={1}
                    isEditing={editingHandle === child.handle} form={form} setForm={setForm}
                    saving={saving} onEdit={() => startEdit(child)} onSave={handleSave}
                    onCancel={() => setEditingHandle(null)} onDelete={() => setDeleteConfirm(child.handle)} />
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* New collection inline form */}
      {editingHandle === '__new__' && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold mb-4">Them bo suu tap moi</h3>
          <div className="grid grid-cols-4 gap-4">
            <input type="text" placeholder="Handle *" value={form.handle} onChange={e => setForm(prev => ({ ...prev, handle: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="text" placeholder="Tieu de *" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <select value={form.parentHandle} onChange={e => setForm(prev => ({ ...prev, parentHandle: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">-- Parent --</option>
              {parents.map(p => <option key={p.handle} value={p.handle}>{p.title}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#795F06] text-white rounded-lg text-sm hover:bg-[#5a4704] disabled:opacity-50">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={() => setEditingHandle(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-lg mb-2">Xac nhan xoa</h3>
            <p className="text-sm text-gray-500 mb-6">Xoa bo suu tap "{deleteConfirm}"?</p>
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

function CollectionRow({ collection, indent, isEditing, form, setForm, saving, onEdit, onSave, onCancel, onDelete }: {
  collection: Collection; indent: number; isEditing: boolean;
  form: { handle: string; title: string; image: string; parentHandle: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  saving: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void; onDelete: () => void;
}) {
  if (isEditing) {
    return (
      <tr className="border-b border-gray-50 bg-amber-50/30">
        <td className="px-6 py-3" style={{ paddingLeft: `${24 + indent * 24}px` }}>
          <input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm w-full" />
        </td>
        <td className="px-6 py-3 text-sm text-gray-500">{collection.handle}</td>
        <td className="px-6 py-3 text-sm text-right">{collection.productCount}</td>
        <td className="px-6 py-3">
          <div className="flex gap-1 justify-end">
            <button onClick={onSave} disabled={saving} className="p-2 bg-[#795F06] text-white rounded-lg hover:bg-[#5a4704]"><Save className="w-3.5 h-3.5" /></button>
            <button onClick={onCancel} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><X className="w-3.5 h-3.5" /></button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
      <td className="px-6 py-3" style={{ paddingLeft: `${24 + indent * 24}px` }}>
        <div className="flex items-center gap-3">
          {collection.image && <img src={collection.image} alt="" className="w-8 h-8 object-cover rounded-lg" referrerPolicy="no-referrer" />}
          <span className="text-sm font-medium">{indent > 0 ? '└ ' : ''}{collection.title}</span>
        </div>
      </td>
      <td className="px-6 py-3 text-sm text-gray-500 font-mono text-xs">{collection.handle}</td>
      <td className="px-6 py-3 text-sm text-right">{collection.productCount}</td>
      <td className="px-6 py-3">
        <div className="flex gap-1 justify-end">
          <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4 text-gray-400" /></button>
          <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      </td>
    </tr>
  );
}
