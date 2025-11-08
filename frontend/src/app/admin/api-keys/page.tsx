'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Plus, Edit, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface APIKey {
  id: number;
  name: string;
  key: string;
  permissions: string[];
  last_used?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminAPIKeysPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [showKey, setShowKey] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[],
    expires_at: '',
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchKeys(token);
  }, [router]);

  const fetchKeys = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/api-keys', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setKeys(data.keys || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת מפתחות API', 'error');
      }
    } catch (err) {
      console.error('Error fetching keys:', err);
      showToast('שגיאה בטעינת מפתחות API', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const url = editingKey
        ? `/api/admin/api-keys/${editingKey.id}`
        : '/api/admin/api-keys';
      const method = editingKey ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          expires_at: formData.expires_at || null,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        if (!editingKey && data.key) {
          // Show new key to user
          setShowKey(data.key.id);
        }
        showToast(editingKey ? 'מפתח עודכן בהצלחה' : 'מפתח נוצר בהצלחה', 'success');
        setShowForm(false);
        setEditingKey(null);
        resetForm();
        fetchKeys(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת מפתח', 'error');
      }
    } catch (err) {
      console.error('Error saving key:', err);
      showToast('שגיאה בשמירת מפתח', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המפתח הזה?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/api-keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('מפתח נמחק בהצלחה', 'success');
        fetchKeys(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת מפתח', 'error');
      }
    } catch (err) {
      console.error('Error deleting key:', err);
      showToast('שגיאה במחיקת מפתח', 'error');
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast('מפתח הועתק ללוח', 'success');
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleEdit = (key: APIKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      permissions: key.permissions || [],
      expires_at: key.expires_at ? new Date(key.expires_at).toISOString().split('T')[0] : '',
      is_active: key.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      permissions: [],
      expires_at: '',
      is_active: true,
    });
  };

  const permissions = [
    { value: 'read_products', label: 'קריאת מוצרים' },
    { value: 'write_products', label: 'כתיבת מוצרים' },
    { value: 'read_orders', label: 'קריאת הזמנות' },
    { value: 'write_orders', label: 'כתיבת הזמנות' },
    { value: 'read_users', label: 'קריאת משתמשים' },
    { value: 'read_analytics', label: 'קריאת אנליטיקה' },
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Key className="size-8 text-gold" />
              ניהול מפתחות API
            </h1>
            <p className="text-zinc-400">יצירה וניהול מפתחות API</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingKey(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Plus className="size-5" />
            מפתח חדש
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingKey ? 'ערוך מפתח' : 'מפתח חדש'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">שם מפתח *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="שם תיאורי למפתח"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">הרשאות *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((perm) => (
                      <label key={perm.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.value)}
                          onChange={() => togglePermission(perm.value)}
                          className="rounded"
                        />
                        <span className="text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">תאריך תפוגה</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                  <p className="text-xs text-zinc-400 mt-1">השאר ריק ללא תאריך תפוגה</p>
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
                    {editingKey ? 'עדכן' : 'צור'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingKey(null);
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

        {/* Keys Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מפתח</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הרשאות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שימוש אחרון</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תפוגה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {keys.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      אין מפתחות להצגה
                    </td>
                  </tr>
                ) : (
                  keys.map((key) => (
                    <tr key={key.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{key.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-zinc-300 bg-zinc-900 px-2 py-1 rounded">
                            {showKey === key.id ? key.key : '••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                            className="text-zinc-400 hover:text-white transition"
                          >
                            {showKey === key.id ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                          <button
                            onClick={() => handleCopy(key.key)}
                            className="text-zinc-400 hover:text-white transition"
                          >
                            <Copy className="size-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {key.permissions?.slice(0, 3).map((p, idx) => (
                            <span key={idx} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
                              {p}
                            </span>
                          ))}
                          {key.permissions && key.permissions.length > 3 && (
                            <span className="text-xs text-zinc-400">+{key.permissions.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {key.last_used
                            ? new Date(key.last_used).toLocaleDateString('he-IL')
                            : 'לא נעשה שימוש'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {key.expires_at
                            ? new Date(key.expires_at).toLocaleDateString('he-IL')
                            : 'ללא תפוגה'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          key.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {key.is_active ? 'פעיל' : 'לא פעיל'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(key)}
                            className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(key.id)}
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

