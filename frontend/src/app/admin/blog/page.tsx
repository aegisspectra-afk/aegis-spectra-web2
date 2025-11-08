'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Search, Filter, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: 'published' | 'draft';
  views: number;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featured: false,
    status: 'draft' as 'published' | 'draft',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchPosts(token);
  }, [router, statusFilter, categoryFilter]);

  const fetchPosts = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const res = await fetch(`/api/admin/blog/posts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setPosts(data.posts || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת פוסטים', 'error');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      showToast('שגיאה בטעינת פוסטים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const url = editingPost
        ? `/api/admin/blog/posts/${editingPost.id}`
        : '/api/admin/blog/posts';
      const method = editingPost ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(editingPost ? 'פוסט עודכן בהצלחה' : 'פוסט נוצר בהצלחה', 'success');
        setShowForm(false);
        setEditingPost(null);
        resetForm();
        fetchPosts(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת פוסט', 'error');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      showToast('שגיאה בשמירת פוסט', 'error');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הפוסט הזה?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('פוסט נמחק בהצלחה', 'success');
        fetchPosts(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת פוסט', 'error');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      showToast('שגיאה במחיקת פוסט', 'error');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      featured: post.featured,
      status: post.status,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featured: false,
      status: 'draft',
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-zinc-400">טוען...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FileText className="size-8 text-gold" />
              ניהול בלוג
            </h1>
            <p className="text-zinc-400">יצירה, עריכה ומחיקה של פוסטים</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingPost(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Plus className="size-5" />
            פוסט חדש
          </button>
        </div>

        {/* Filters */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-5" />
              <input
                type="text"
                placeholder="חיפוש פוסטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-gold"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="published">פורסם</option>
              <option value="draft">טיוטה</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">כל הקטגוריות</option>
              <option value="מדריכים">מדריכים</option>
              <option value="טיפים">טיפים</option>
              <option value="טכנולוגיה">טכנולוגיה</option>
              <option value="חדשות">חדשות</option>
            </select>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingPost ? 'ערוך פוסט' : 'פוסט חדש'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">כותרת *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (!editingPost) {
                        setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                      }
                    }}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">תקציר *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">תוכן *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={10}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">קטגוריה *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    >
                      <option value="">בחר קטגוריה</option>
                      <option value="מדריכים">מדריכים</option>
                      <option value="טיפים">טיפים</option>
                      <option value="טכנולוגיה">טכנולוגיה</option>
                      <option value="חדשות">חדשות</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">תגיות (מופרדות בפסיק)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="תגית1, תגית2, תגית3"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">סטטוס *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    >
                      <option value="draft">טיוטה</option>
                      <option value="published">פורסם</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-sm">פוסט מומלץ</label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
                  >
                    {editingPost ? 'עדכן' : 'צור'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border-2 border-zinc-700 rounded-lg font-semibold hover:bg-zinc-800 transition"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">כותרת</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">קטגוריה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">צפיות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                      אין פוסטים להצגה
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{post.title}</div>
                        <div className="text-sm text-zinc-400">{post.excerpt.substring(0, 50)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-sm bg-zinc-700 text-zinc-300">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          post.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {post.status === 'published' ? 'פורסם' : 'טיוטה'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{post.views || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {new Date(post.publishedAt).toLocaleDateString('he-IL')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Eye className="size-4" />
                            צפה
                          </Link>
                          <button
                            onClick={() => handleEdit(post)}
                            className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

