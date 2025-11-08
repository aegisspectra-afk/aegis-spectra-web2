'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Upload, Trash2, Edit, Search, Filter } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Image {
  id: number;
  filename: string;
  url: string;
  alt_text?: string;
  category: string;
  size: number;
  width?: number;
  height?: number;
  created_at: string;
}

export default function AdminImagesPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    alt_text: '',
    category: 'product',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchImages(token);
  }, [router, filterCategory, searchQuery]);

  const fetchImages = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/images?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setImages(data.images || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת תמונות', 'error');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      showToast('שגיאה בטעינת תמונות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('נא לבחור קובץ', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('alt_text', uploadData.alt_text);
      formData.append('category', uploadData.category);

      const res = await fetch('/api/admin/images', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.ok) {
        showToast('תמונה הועלתה בהצלחה', 'success');
        setShowUpload(false);
        setUploadFile(null);
        setUploadData({ alt_text: '', category: 'product' });
        fetchImages(token);
      } else {
        showToast(data.error || 'שגיאה בהעלאת תמונה', 'error');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      showToast('שגיאה בהעלאת תמונה', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את התמונה הזו?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/images/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('תמונה נמחקה בהצלחה', 'success');
        fetchImages(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת תמונה', 'error');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      showToast('שגיאה במחיקת תמונה', 'error');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      product: 'מוצר',
      category: 'קטגוריה',
      banner: 'באנר',
      logo: 'לוגו',
      gallery: 'גלריה',
    };
    return labels[category] || category;
  };

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
              <ImageIcon className="size-8 text-gold" />
              ניהול תמונות
            </h1>
            <p className="text-zinc-400">העלאה, עריכה וניהול תמונות</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Upload className="size-5" />
            העלה תמונה
          </button>
        </div>

        {/* Filters */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">קטגוריה</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="all">כל הקטגוריות</option>
                <option value="product">מוצר</option>
                <option value="category">קטגוריה</option>
                <option value="banner">באנר</option>
                <option value="logo">לוגו</option>
                <option value="gallery">גלריה</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">חיפוש</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש לפי שם או טקסט חלופי"
                  className="w-full px-4 py-2 pr-10 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">העלה תמונה</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">קובץ תמונה *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">טקסט חלופי</label>
                  <input
                    type="text"
                    value={uploadData.alt_text}
                    onChange={(e) => setUploadData({ ...uploadData, alt_text: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="תיאור התמונה"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">קטגוריה *</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  >
                    <option value="product">מוצר</option>
                    <option value="category">קטגוריה</option>
                    <option value="banner">באנר</option>
                    <option value="logo">לוגו</option>
                    <option value="gallery">גלריה</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
                  >
                    העלה
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpload(false);
                      setUploadFile(null);
                      setUploadData({ alt_text: '', category: 'product' });
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

        {/* Images Grid */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
          {images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">אין תמונות להצגה</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image) => (
                <div key={image.id} className="bg-zinc-900 rounded-lg overflow-hidden group relative">
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.alt_text || image.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-white truncate">{image.filename}</p>
                    <p className="text-xs text-zinc-400">{getCategoryLabel(image.category)}</p>
                    <p className="text-xs text-zinc-500">{formatFileSize(image.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

