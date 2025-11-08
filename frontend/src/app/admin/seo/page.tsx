'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Save, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface SEOData {
  page: string;
  title: string;
  description: string;
  keywords: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots?: string;
}

export default function AdminSEOPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [seoData, setSeoData] = useState<SEOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const [formData, setFormData] = useState<SEOData>({
    page: 'home',
    title: '',
    description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots: 'index, follow',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSEOData(token);
  }, [router]);

  useEffect(() => {
    if (seoData.length > 0) {
      const pageData = seoData.find(d => d.page === selectedPage);
      if (pageData) {
        setFormData(pageData);
      } else {
        setFormData({
          page: selectedPage,
          title: '',
          description: '',
          keywords: '',
          og_title: '',
          og_description: '',
          og_image: '',
          canonical_url: '',
          robots: 'index, follow',
        });
      }
    }
  }, [selectedPage, seoData]);

  const fetchSEOData = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setSeoData(data.seoData || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת נתוני SEO', 'error');
      }
    } catch (err) {
      console.error('Error fetching SEO data:', err);
      showToast('שגיאה בטעינת נתוני SEO', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('נתוני SEO נשמרו בהצלחה', 'success');
        fetchSEOData(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת נתוני SEO', 'error');
      }
    } catch (err) {
      console.error('Error saving SEO data:', err);
      showToast('שגיאה בשמירת נתוני SEO', 'error');
    }
  };

  const pages = [
    { value: 'home', label: 'דף הבית' },
    { value: 'products', label: 'מוצרים' },
    { value: 'about', label: 'אודות' },
    { value: 'contact', label: 'צור קשר' },
    { value: 'blog', label: 'בלוג' },
  ];

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Search className="size-8 text-gold" />
            ניהול SEO
          </h1>
          <p className="text-zinc-400">ניהול meta tags, Open Graph ו-structured data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Page Selection */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-4">
              <h2 className="text-lg font-bold mb-4">בחר עמוד</h2>
              <div className="space-y-2">
                {pages.map((page) => (
                  <button
                    key={page.value}
                    onClick={() => setSelectedPage(page.value)}
                    className={`w-full text-right px-4 py-2 rounded-lg transition ${
                      selectedPage === page.value
                        ? 'bg-gold text-black font-semibold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-black/30 border border-zinc-800 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">כותרת (Title) *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  maxLength={60}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  placeholder="כותרת SEO (עד 60 תווים)"
                />
                <p className="text-xs text-zinc-400 mt-1">{formData.title.length}/60</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">תיאור (Description) *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                  placeholder="תיאור SEO (עד 160 תווים)"
                />
                <p className="text-xs text-zinc-400 mt-1">{formData.description.length}/160</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">מילות מפתח (Keywords)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  placeholder="מילה1, מילה2, מילה3"
                />
              </div>

              <div className="border-t border-zinc-700 pt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Globe className="size-5 text-gold" />
                  Open Graph
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">OG Title</label>
                    <input
                      type="text"
                      value={formData.og_title || ''}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">OG Description</label>
                    <textarea
                      value={formData.og_description || ''}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">OG Image URL</label>
                    <input
                      type="url"
                      value={formData.og_image || ''}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-700 pt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="size-5 text-gold" />
                  הגדרות נוספות
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Canonical URL</label>
                    <input
                      type="url"
                      value={formData.canonical_url || ''}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                      placeholder="https://example.com/page"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Robots</label>
                    <select
                      value={formData.robots || 'index, follow'}
                      onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    >
                      <option value="index, follow">index, follow</option>
                      <option value="index, nofollow">index, nofollow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition flex items-center justify-center gap-2"
              >
                <Save className="size-5" />
                שמור נתוני SEO
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

