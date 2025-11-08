'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Coupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_count: number;
  valid_from?: string;
  valid_until?: string;
  user_id?: number;
  user_email?: string;
  active: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: 0,
    min_purchase: 0,
    max_discount: 0,
    usage_limit: 1,
    valid_from: '',
    valid_until: '',
    user_email: '',
    active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchCoupons(token);
  }, [router, activeFilter]);

  const fetchCoupons = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilter !== 'all') params.append('active', activeFilter);

      const res = await fetch(`/api/admin/coupons?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setCoupons(data.coupons || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת קופונים', 'error');
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      showToast('שגיאה בטעינת קופונים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      const method = editingCoupon ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(editingCoupon ? 'קופון עודכן בהצלחה' : 'קופון נוצר בהצלחה', 'success');
        setShowForm(false);
        setEditingCoupon(null);
        resetForm();
        fetchCoupons(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת קופון', 'error');
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
      showToast('שגיאה בשמירת קופון', 'error');
    }
  };

  const handleDelete = async (couponId: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הקופון הזה?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('קופון נמחק בהצלחה', 'success');
        fetchCoupons(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת קופון', 'error');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
      showToast('שגיאה במחיקת קופון', 'error');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase: coupon.min_purchase || 0,
      max_discount: coupon.max_discount || 0,
      usage_limit: coupon.usage_limit || 1,
      valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
      user_email: coupon.user_email || '',
      active: coupon.active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percent',
      discount_value: 0,
      min_purchase: 0,
      max_discount: 0,
      usage_limit: 1,
      valid_from: '',
      valid_until: '',
      user_email: '',
      active: true,
    });
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (coupon.user_email && coupon.user_email.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <Tag className="size-8 text-gold" />
              ניהול קופונים והנחות
            </h1>
            <p className="text-zinc-400">יצירה, עריכה ומחיקה של קופונים והנחות</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingCoupon(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Plus className="size-5" />
            קופון חדש
          </button>
        </div>

        {/* Filters */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-5" />
              <input
                type="text"
                placeholder="חיפוש קופון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-gold"
              />
            </div>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">כל הקופונים</option>
              <option value="true">פעילים</option>
              <option value="false">לא פעילים</option>
            </select>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingCoupon ? 'ערוך קופון' : 'קופון חדש'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">קוד קופון *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">סוג הנחה *</label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percent' | 'fixed' })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    >
                      <option value="percent">אחוז (%)</option>
                      <option value="fixed">סכום קבוע (₪)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ערך הנחה *</label>
                    <input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                      required
                      min="0"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">רכישה מינימלית (₪)</label>
                    <input
                      type="number"
                      value={formData.min_purchase}
                      onChange={(e) => setFormData({ ...formData, min_purchase: parseFloat(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">הנחה מקסימלית (₪)</label>
                    <input
                      type="number"
                      value={formData.max_discount}
                      onChange={(e) => setFormData({ ...formData, max_discount: parseFloat(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">מספר שימושים מקסימלי</label>
                    <input
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">אימייל משתמש (אופציונלי)</label>
                    <input
                      type="email"
                      value={formData.user_email}
                      onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">תאריך התחלה</label>
                    <input
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">תאריך סיום</label>
                    <input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm">פעיל</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
                  >
                    {editingCoupon ? 'עדכן' : 'צור'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCoupon(null);
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

        {/* Coupons Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">קוד</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סוג</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">ערך</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שימושים</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תוקף</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      אין קופונים להצגה
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-gold font-bold">{coupon.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">
                          {coupon.discount_type === 'percent' ? 'אחוז' : 'סכום קבוע'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">
                          {coupon.discount_type === 'percent'
                            ? `${coupon.discount_value}%`
                            : `${coupon.discount_value.toLocaleString()} ₪`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">
                          {coupon.usage_count || 0} / {coupon.usage_limit || '∞'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {coupon.valid_from && (
                            <div>מ: {new Date(coupon.valid_from).toLocaleDateString('he-IL')}</div>
                          )}
                          {coupon.valid_until && (
                            <div>עד: {new Date(coupon.valid_until).toLocaleDateString('he-IL')}</div>
                          )}
                          {!coupon.valid_from && !coupon.valid_until && <div>ללא הגבלה</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {coupon.active ? (
                          <span className="px-2 py-1 rounded text-sm bg-green-500/20 text-green-400 flex items-center gap-1 w-fit">
                            <CheckCircle className="size-4" />
                            פעיל
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-sm bg-red-500/20 text-red-400 flex items-center gap-1 w-fit">
                            <XCircle className="size-4" />
                            לא פעיל
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
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

