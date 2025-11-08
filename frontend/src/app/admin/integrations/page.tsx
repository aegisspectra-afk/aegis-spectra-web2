'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plug, Plus, Edit, Trash2, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Integration {
  id: number;
  name: string;
  type: string;
  api_key?: string;
  api_secret?: string;
  webhook_url?: string;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
}

export default function AdminIntegrationsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'payment',
    api_key: '',
    api_secret: '',
    webhook_url: '',
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchIntegrations(token);
  }, [router]);

  const fetchIntegrations = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/integrations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setIntegrations(data.integrations || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת אינטגרציות', 'error');
      }
    } catch (err) {
      console.error('Error fetching integrations:', err);
      showToast('שגיאה בטעינת אינטגרציות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const url = editingIntegration
        ? `/api/admin/integrations/${editingIntegration.id}`
        : '/api/admin/integrations';
      const method = editingIntegration ? 'PATCH' : 'POST';

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
        showToast(editingIntegration ? 'אינטגרציה עודכנה בהצלחה' : 'אינטגרציה נוצרה בהצלחה', 'success');
        setShowForm(false);
        setEditingIntegration(null);
        resetForm();
        fetchIntegrations(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת אינטגרציה', 'error');
      }
    } catch (err) {
      console.error('Error saving integration:', err);
      showToast('שגיאה בשמירת אינטגרציה', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את האינטגרציה הזו?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/integrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('אינטגרציה נמחקה בהצלחה', 'success');
        fetchIntegrations(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת אינטגרציה', 'error');
      }
    } catch (err) {
      console.error('Error deleting integration:', err);
      showToast('שגיאה במחיקת אינטגרציה', 'error');
    }
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    setFormData({
      name: integration.name,
      type: integration.type,
      api_key: integration.api_key || '',
      api_secret: integration.api_secret || '',
      webhook_url: integration.webhook_url || '',
      is_active: integration.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'payment',
      api_key: '',
      api_secret: '',
      webhook_url: '',
      is_active: true,
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      payment: 'תשלום',
      shipping: 'משלוח',
      analytics: 'אנליטיקה',
      crm: 'CRM',
      email: 'אימייל',
      sms: 'SMS',
      webhook: 'Webhook',
    };
    return labels[type] || type;
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
              <Plug className="size-8 text-gold" />
              ניהול אינטגרציות
            </h1>
            <p className="text-zinc-400">ניהול חיבורים לשירותים חיצוניים</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingIntegration(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Plus className="size-5" />
            אינטגרציה חדשה
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingIntegration ? 'ערוך אינטגרציה' : 'אינטגרציה חדשה'}
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
                  <label className="block text-sm font-medium mb-2">סוג *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  >
                    <option value="payment">תשלום</option>
                    <option value="shipping">משלוח</option>
                    <option value="analytics">אנליטיקה</option>
                    <option value="crm">CRM</option>
                    <option value="email">אימייל</option>
                    <option value="sms">SMS</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="text"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Secret</label>
                  <input
                    type="password"
                    value={formData.api_secret}
                    onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook URL</label>
                  <input
                    type="url"
                    value={formData.webhook_url}
                    onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="https://example.com/webhook"
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
                    {editingIntegration ? 'עדכן' : 'צור'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingIntegration(null);
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

        {/* Integrations Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סוג</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סנכרון אחרון</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {integrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                      אין אינטגרציות להצגה
                    </td>
                  </tr>
                ) : (
                  integrations.map((integration) => (
                    <tr key={integration.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{integration.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{getTypeLabel(integration.type)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 w-fit ${
                          integration.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {integration.is_active ? (
                            <>
                              <CheckCircle className="size-4" />
                              פעיל
                            </>
                          ) : (
                            <>
                              <XCircle className="size-4" />
                              לא פעיל
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {integration.last_sync
                            ? new Date(integration.last_sync).toLocaleDateString('he-IL')
                            : 'אין'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(integration)}
                            className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(integration.id)}
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

