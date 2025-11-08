'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Plus, Edit, Trash2, Package, MapPin } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  cost: number;
  free_shipping_threshold?: number;
  estimated_days: number;
  is_active: boolean;
  zones?: string[];
  weight_limit?: number;
}

export default function AdminShippingPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: 0,
    free_shipping_threshold: '',
    estimated_days: 3,
    is_active: true,
    zones: '',
    weight_limit: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchMethods(token);
  }, [router]);

  const fetchMethods = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shipping/methods', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setMethods(data.methods || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת שיטות משלוח', 'error');
      }
    } catch (err) {
      console.error('Error fetching methods:', err);
      showToast('שגיאה בטעינת שיטות משלוח', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const url = editingMethod
        ? `/api/admin/shipping/methods/${editingMethod.id}`
        : '/api/admin/shipping/methods';
      const method = editingMethod ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          free_shipping_threshold: formData.free_shipping_threshold ? parseFloat(formData.free_shipping_threshold) : null,
          weight_limit: formData.weight_limit ? parseFloat(formData.weight_limit) : null,
          zones: formData.zones ? formData.zones.split(',').map(z => z.trim()) : [],
        }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(editingMethod ? 'שיטת משלוח עודכנה בהצלחה' : 'שיטת משלוח נוצרה בהצלחה', 'success');
        setShowForm(false);
        setEditingMethod(null);
        resetForm();
        fetchMethods(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת שיטת משלוח', 'error');
      }
    } catch (err) {
      console.error('Error saving method:', err);
      showToast('שגיאה בשמירת שיטת משלוח', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את שיטת המשלוח הזו?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/shipping/methods/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('שיטת משלוח נמחקה בהצלחה', 'success');
        fetchMethods(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת שיטת משלוח', 'error');
      }
    } catch (err) {
      console.error('Error deleting method:', err);
      showToast('שגיאה במחיקת שיטת משלוח', 'error');
    }
  };

  const handleEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      description: method.description || '',
      cost: method.cost,
      free_shipping_threshold: method.free_shipping_threshold?.toString() || '',
      estimated_days: method.estimated_days,
      is_active: method.is_active,
      zones: method.zones?.join(', ') || '',
      weight_limit: method.weight_limit?.toString() || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cost: 0,
      free_shipping_threshold: '',
      estimated_days: 3,
      is_active: true,
      zones: '',
      weight_limit: '',
    });
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
              <Truck className="size-8 text-gold" />
              ניהול משלוחים
            </h1>
            <p className="text-zinc-400">ניהול שיטות משלוח ועלויות</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingMethod(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Plus className="size-5" />
            שיטת משלוח חדשה
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingMethod ? 'ערוך שיטת משלוח' : 'שיטת משלוח חדשה'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">שם *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">תיאור</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">עלות (₪) *</label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ימים משוערים *</label>
                    <input
                      type="number"
                      value={formData.estimated_days}
                      onChange={(e) => setFormData({ ...formData, estimated_days: parseInt(e.target.value) || 3 })}
                      required
                      min="1"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">סף משלוח חינם (₪)</label>
                    <input
                      type="number"
                      value={formData.free_shipping_threshold}
                      onChange={(e) => setFormData({ ...formData, free_shipping_threshold: e.target.value })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">מגבלת משקל (ק&quot;ג)</label>
                    <input
                      type="number"
                      value={formData.weight_limit}
                      onChange={(e) => setFormData({ ...formData, weight_limit: e.target.value })}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">אזורים (מופרדים בפסיק)</label>
                  <input
                    type="text"
                    value={formData.zones}
                    onChange={(e) => setFormData({ ...formData, zones: e.target.value })}
                    placeholder="תל אביב, ירושלים, חיפה"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
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
                    className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
                  >
                    {editingMethod ? 'עדכן' : 'צור'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingMethod(null);
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

        {/* Methods List */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">עלות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">ימים משוערים</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משלוח חינם מ-</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {methods.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                      אין שיטות משלוח להצגה
                    </td>
                  </tr>
                ) : (
                  methods.map((method) => (
                    <tr key={method.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{method.name}</div>
                        {method.description && (
                          <div className="text-sm text-zinc-400">{method.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{method.cost.toLocaleString('he-IL')} ₪</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{method.estimated_days} ימים</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">
                          {method.free_shipping_threshold
                            ? `${method.free_shipping_threshold.toLocaleString('he-IL')} ₪`
                            : 'ללא'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          method.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {method.is_active ? 'פעיל' : 'לא פעיל'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(method)}
                            className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
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

