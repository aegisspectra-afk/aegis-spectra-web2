'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Plus, Edit, Trash2, Eye, Save } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  type: string;
  variables?: string[];
  is_active: boolean;
  created_at: string;
}

export default function AdminEmailTemplatesPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    type: 'order_confirmation',
    variables: '',
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTemplates(token);
  }, [router]);

  const fetchTemplates = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email-templates', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setTemplates(data.templates || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת תבניות אימייל', 'error');
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      showToast('שגיאה בטעינת תבניות אימייל', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const url = editingTemplate
        ? `/api/admin/email-templates/${editingTemplate.id}`
        : '/api/admin/email-templates';
      const method = editingTemplate ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          variables: formData.variables ? formData.variables.split(',').map(v => v.trim()) : [],
        }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(editingTemplate ? 'תבנית עודכנה בהצלחה' : 'תבנית נוצרה בהצלחה', 'success');
        setShowForm(false);
        setEditingTemplate(null);
        resetForm();
        fetchTemplates(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת תבנית', 'error');
      }
    } catch (err) {
      console.error('Error saving template:', err);
      showToast('שגיאה בשמירת תבנית', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את התבנית הזו?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('תבנית נמחקה בהצלחה', 'success');
        fetchTemplates(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת תבנית', 'error');
      }
    } catch (err) {
      console.error('Error deleting template:', err);
      showToast('שגיאה במחיקת תבנית', 'error');
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type,
      variables: template.variables?.join(', ') || '',
      is_active: template.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      body: '',
      type: 'order_confirmation',
      variables: '',
      is_active: true,
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order_confirmation: 'אישור הזמנה',
      order_shipped: 'הזמנה נשלחה',
      order_delivered: 'הזמנה נמסרה',
      welcome: 'ברוכים הבאים',
      password_reset: 'איפוס סיסמה',
      newsletter: 'ניוזלטר',
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
              <Mail className="size-8 text-gold" />
              ניהול תבניות אימייל
            </h1>
            <p className="text-zinc-400">יצירה ועריכה של תבניות אימייל</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingTemplate(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Plus className="size-5" />
            תבנית חדשה
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingTemplate ? 'ערוך תבנית' : 'תבנית חדשה'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">שם תבנית *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">סוג תבנית *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    >
                      <option value="order_confirmation">אישור הזמנה</option>
                      <option value="order_shipped">הזמנה נשלחה</option>
                      <option value="order_delivered">הזמנה נמסרה</option>
                      <option value="welcome">ברוכים הבאים</option>
                      <option value="password_reset">איפוס סיסמה</option>
                      <option value="newsletter">ניוזלטר</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">נושא (Subject) *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="נושא האימייל"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">תוכן (Body) *</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    required
                    rows={12}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none font-mono text-sm"
                    placeholder="תוכן האימייל (HTML או טקסט)"
                  />
                  <p className="text-xs text-zinc-400 mt-1">
                    ניתן להשתמש במשתנים: {'{{name}}'}, {'{{email}}'}, {'{{order_id}}'}, {'{{total}}'} וכו'
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">משתנים זמינים (מופרדים בפסיק)</label>
                  <input
                    type="text"
                    value={formData.variables}
                    onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="name, email, order_id, total"
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
                    className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition flex items-center justify-center gap-2"
                  >
                    <Save className="size-5" />
                    {editingTemplate ? 'עדכן' : 'צור'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTemplate(null);
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

        {/* Templates Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סוג</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">נושא</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתנים</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {templates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                      אין תבניות להצגה
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => (
                    <tr key={template.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{template.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{getTypeLabel(template.type)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <span className="text-zinc-300 text-sm line-clamp-1">{template.subject}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {template.variables?.slice(0, 3).map((v, idx) => (
                            <span key={idx} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
                              {v}
                            </span>
                          ))}
                          {template.variables && template.variables.length > 3 && (
                            <span className="text-xs text-zinc-400">+{template.variables.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          template.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {template.is_active ? 'פעיל' : 'לא פעיל'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(template)}
                            className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(template.id)}
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

