'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Tag, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToastContext } from '@/components/ToastProvider';

interface Coupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit: number;
  usage_count: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

export default function AdminCouponEditPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToastContext();
  const couponId = params.id as string;
  const isNew = couponId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: 0,
    min_purchase: '',
    max_discount: '',
    usage_limit: 1,
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchCoupon();
    }
  }, [couponId, isNew]);

  const fetchCoupon = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setCoupon(data.coupon);
        setFormData({
          code: data.coupon.code || '',
          discount_type: data.coupon.discount_type || 'percent',
          discount_value: data.coupon.discount_value || 0,
          min_purchase: data.coupon.min_purchase || '',
          max_discount: data.coupon.max_discount || '',
          usage_limit: data.coupon.usage_limit || 1,
          valid_from: data.coupon.valid_from ? new Date(data.coupon.valid_from).toISOString().split('T')[0] : '',
          valid_until: data.coupon.valid_until ? new Date(data.coupon.valid_until).toISOString().split('T')[0] : '',
          is_active: data.coupon.is_active !== false,
        });
      } else {
        showToast(data.error || 'שגיאה בטעינת קופון', 'error');
        router.push('/admin/coupons');
      }
    } catch (err) {
      console.error('Error fetching coupon:', err);
      showToast('שגיאה בטעינת קופון', 'error');
      router.push('/admin/coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const url = isNew ? '/api/admin/coupons' : `/api/admin/coupons/${couponId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null,
          max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
          valid_from: formData.valid_from || null,
          valid_until: formData.valid_until || null,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(isNew ? 'קופון נוצר בהצלחה' : 'קופון עודכן בהצלחה', 'success');
        router.push('/admin/coupons');
      } else {
        showToast(data.error || 'שגיאה בשמירת קופון', 'error');
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
      showToast('שגיאה בשמירת קופון', 'error');
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

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/coupons"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition mb-4"
          >
            <ArrowRight className="size-4" />
            חזרה לרשימת קופונים
          </Link>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Tag className="size-8 text-gold" />
            {isNew ? 'קופון חדש' : 'ערוך קופון'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/30 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">קוד קופון *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="SUMMER2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">סוג הנחה *</label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percent' | 'fixed' })}
                required
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="percent">אחוזים (%)</option>
                <option value="fixed">סכום קבוע (₪)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ערך הנחה *</label>
              <input
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder={formData.discount_type === 'percent' ? '10' : '100'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">מינימום רכישה (₪)</label>
              <input
                type="number"
                value={formData.min_purchase}
                onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">מקסימום הנחה (₪)</label>
              <input
                type="number"
                value={formData.max_discount}
                onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">מגבלת שימוש *</label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) || 1 })}
                required
                min="0"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="1 (0 = ללא הגבלה)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">תוקף מ-</label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">תוקף עד</label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded"
            />
            <label className="text-sm">פעיל</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
              {isNew ? 'צור קופון' : 'שמור שינויים'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/coupons')}
              className="flex-1 px-4 py-2 border-2 border-zinc-700 rounded-lg font-semibold hover:bg-zinc-800 transition"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

