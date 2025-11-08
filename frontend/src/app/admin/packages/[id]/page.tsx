/**
 * Admin Package Edit Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Save, X, Package } from 'lucide-react';
import Link from 'next/link';
import { packages, getPackageBySlug } from '@/data/packages';
import { Package as PackageType } from '@/types/packages';
import { useToastContext } from '@/components/ToastProvider';

export default function AdminPackageEditPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToastContext();
  const packageId = params.id as string;
  
  const [packageData, setPackageData] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Load package data
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setPackageData(pkg);
      setFormData({
        name: pkg.name,
        nameHebrew: pkg.nameHebrew,
        description: pkg.description,
        category: pkg.category,
        slug: pkg.slug,
        pricing: pkg.pricing,
        features: pkg.features,
        specifications: pkg.specifications,
        addons: pkg.addons,
        popular: pkg.popular || false,
        recommended: pkg.recommended || false,
      });
    } else {
      showToast('חבילה לא נמצאה', 'error');
      router.push('/admin/packages');
    }
    setLoading(false);
  }, [packageId, router, showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('חבילה עודכנה בהצלחה', 'success');
        router.push('/admin/packages');
      } else {
        showToast(data.error || 'שגיאה בעדכון חבילה', 'error');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      showToast('שגיאה בעדכון חבילה', 'error');
    } finally {
      setSaving(false);
    }
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

  if (!packageData) {
    return null;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition mb-4"
          >
            <ArrowRight className="size-4" />
            חזרה לרשימת חבילות
          </Link>
          <h1 className="text-4xl font-bold mb-2">עריכת חבילה</h1>
          <p className="text-zinc-400">{packageData.nameHebrew}</p>
        </div>

        {/* Form */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              שם עברית *
            </label>
            <input
              type="text"
              value={formData.nameHebrew || ''}
              onChange={(e) => setFormData({ ...formData, nameHebrew: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              שם אנגלית *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              תיאור
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                קטגוריה *
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                required
              >
                <option value="Residential">מגזר פרטי</option>
                <option value="Commercial">מגזר עסקי</option>
                <option value="Enterprise">מגזר ארגוני</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                מחיר בסיס (₪) *
              </label>
              <input
                type="number"
                value={formData.pricing?.base || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, base: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular || false}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-zinc-300">פופולרי</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recommended || false}
                onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-zinc-300">מומלץ</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-zinc-800">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold/90 transition disabled:opacity-50"
            >
              <Save className="size-5" />
              {saving ? 'שומר...' : 'שמור שינויים'}
            </button>
            <Link
              href="/admin/packages"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-zinc-700 rounded-xl font-semibold hover:bg-zinc-800 transition"
            >
              <X className="size-5" />
              ביטול
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

