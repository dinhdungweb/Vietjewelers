import { useState, useEffect, useCallback } from 'react';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { apiPost, apiPut, apiDelete } from '../../lib/api';
import type { BlogPost } from '../../types/product';
import {
  Plus, Edit, Trash2, X, Save, Upload, ArrowLeft, Eye, Calendar, Tag,
} from 'lucide-react';

function generateHandle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

const emptyPost: BlogPost = { handle: '', title: '', excerpt: '', image: '', tags: [], date: todayStr(), content: '' };

export default function BlogManager() {
  const { posts, loading } = useBlogPosts();
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [editingPost, setEditingPost] = useState<BlogPost>(emptyPost);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const startCreate = () => {
    setEditingPost({ ...emptyPost, date: todayStr() });
    setIsNew(true);
    setMode('edit');
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsNew(false);
    setMode('edit');
  };

  const handleDelete = async (handle: string) => {
    try {
      await apiDelete(`/admin/blog-posts/${handle}`);
      setDeleteConfirm(null);
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async () => {
    if (!editingPost.title.trim()) {
      alert('Vui long nhap tieu de');
      return;
    }
    setSaving(true);
    const handle = editingPost.handle || generateHandle(editingPost.title);
    const payload = { ...editingPost, handle };

    try {
      if (isNew) {
        await apiPost('/admin/blog-posts', payload);
      } else {
        await apiPut(`/admin/blog-posts/${handle}`, payload);
      }
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File qua lon (> 10MB)');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();
      if (data.url) setEditingPost(prev => ({ ...prev, image: data.url }));
    } catch {
      alert('Loi upload anh');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-[#795F06] border-t-transparent rounded-full animate-spin" /></div>;

  if (mode === 'edit') {
    return (
      <BlogEditor post={editingPost} setPost={setEditingPost} isNew={isNew}
        onSave={handleSave} onCancel={() => setMode('list')} onImageUpload={handleImageUpload} saving={saving} />
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e1e2d]">Quan ly Blog ({posts.length})</h2>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#795F06] text-white rounded-xl text-sm font-medium hover:bg-[#5a4704]">
          <Plus className="w-4 h-4" /> Tao bai viet
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Bai viet</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Ngay</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tags</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.handle} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {post.image && <img src={post.image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[300px]">{post.title}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[300px]">{post.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{tag}</span>)}
                    {post.tags.length > 2 && <span className="text-[10px] text-gray-400">+{post.tags.length - 2}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 justify-end">
                    <a href={`/blogs/news/${post.handle}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-400" /></a>
                    <button onClick={() => startEdit(post)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4 text-gray-400" /></button>
                    <button onClick={() => setDeleteConfirm(post.handle)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center text-gray-400 py-12 text-sm">Chua co bai viet nao</p>}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-lg mb-2">Xac nhan xoa</h3>
            <p className="text-sm text-gray-500 mb-6">Ban co chac muon xoa bai viet nay?</p>
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

function BlogEditor({ post, setPost, isNew, onSave, onCancel, onImageUpload, saving }: {
  post: BlogPost; setPost: React.Dispatch<React.SetStateAction<BlogPost>>; isNew: boolean;
  onSave: () => void; onCancel: () => void; onImageUpload: (file: File) => void; saving: boolean;
}) {
  const [tagsInput, setTagsInput] = useState(post.tags.join(', '));
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isNew && post.title) {
      setPost(prev => ({ ...prev, handle: generateHandle(prev.title) }));
    }
  }, [post.title, isNew, setPost]);

  const updateTags = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    setPost(prev => ({ ...prev, tags }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="text-2xl font-bold text-[#1e1e2d]">{isNew ? 'Tao bai viet moi' : 'Chinh sua bai viet'}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Huy</button>
          <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-[#795F06] text-white rounded-xl text-sm font-medium hover:bg-[#5a4704] disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Dang luu...' : isNew ? 'Tao bai viet' : 'Luu thay doi'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tieu de *</label>
              <input type="text" value={post.title} onChange={e => setPost(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhap tieu de bai viet..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Handle (URL slug)</label>
              <input type="text" value={post.handle} onChange={e => setPost(prev => ({ ...prev, handle: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" disabled={!isNew} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tom tat</label>
              <textarea value={post.excerpt} onChange={e => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40 resize-none" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Noi dung (HTML)</label>
                <button onClick={() => setPreviewMode(!previewMode)} className="flex items-center gap-1 text-xs text-[#795F06] hover:underline">
                  <Eye className="w-3 h-3" /> {previewMode ? 'Chinh sua' : 'Xem truoc'}
                </button>
              </div>
              {previewMode ? (
                <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm min-h-[200px] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <textarea value={post.content} onChange={e => setPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={12} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#795F06]/40 resize-y" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Anh bia</label>
            {post.image ? (
              <div className="relative mb-3">
                <img src={post.image} alt="" className="w-full aspect-video object-cover rounded-xl" referrerPolicy="no-referrer" />
                <button onClick={() => setPost(prev => ({ ...prev, image: '' }))} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center mb-3">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <label className="text-xs text-[#795F06] cursor-pointer hover:underline font-medium">
                  Chon anh
                  <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onImageUpload(e.target.files[0])} className="hidden" />
                </label>
              </div>
            )}
            <input type="text" value={post.image} onChange={e => setPost(prev => ({ ...prev, image: e.target.value }))}
              placeholder="Hoac nhap URL anh..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2"><Calendar className="w-3.5 h-3.5" /> Ngay dang</label>
            <input type="date" value={post.date} onChange={e => setPost(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2"><Tag className="w-3.5 h-3.5" /> Tags</label>
            <input type="text" value={tagsInput} onChange={e => updateTags(e.target.value)}
              placeholder="tag1, tag2, tag3..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#795F06]/40" />
            <p className="text-[10px] text-gray-400 mt-1.5">Phan cach bang dau phay</p>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{tag}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
