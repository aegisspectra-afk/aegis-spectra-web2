'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Filter, Search, Download, Calendar, User, Activity } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface LogEntry {
  id: number;
  user_id: number;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: number;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export default function AdminEnhancedLogsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: 'all',
    resource_type: 'all',
    user_id: '',
    date_from: '',
    date_to: '',
    search: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchLogs(token);
  }, [router, filters]);

  const fetchLogs = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      const res = await fetch(`/api/admin/logs/enhanced?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setLogs(data.logs || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת לוגים', 'error');
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      showToast('שגיאה בטעינת לוגים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      const res = await fetch(`/api/admin/logs/enhanced/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('לוגים יוצאו בהצלחה', 'success');
      } else {
        showToast('שגיאה בייצוא לוגים', 'error');
      }
    } catch (err) {
      console.error('Error exporting logs:', err);
      showToast('שגיאה בייצוא לוגים', 'error');
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      PRODUCT_CREATED: 'יצירת מוצר',
      PRODUCT_UPDATED: 'עדכון מוצר',
      PRODUCT_DELETED: 'מחיקת מוצר',
      ORDER_CREATED: 'יצירת הזמנה',
      ORDER_UPDATED: 'עדכון הזמנה',
      USER_CREATED: 'יצירת משתמש',
      USER_UPDATED: 'עדכון משתמש',
      SETTINGS_UPDATED: 'עדכון הגדרות',
    };
    return labels[action] || action;
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
              <FileText className="size-8 text-gold" />
              יומן פעילות מתקדם
            </h1>
            <p className="text-zinc-400">מעקב מפורט אחר פעולות במערכת</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
          >
            <Download className="size-5" />
            ייצא CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">פעולה</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="all">כל הפעולות</option>
                <option value="PRODUCT_CREATED">יצירת מוצר</option>
                <option value="PRODUCT_UPDATED">עדכון מוצר</option>
                <option value="ORDER_CREATED">יצירת הזמנה</option>
                <option value="USER_UPDATED">עדכון משתמש</option>
                <option value="SETTINGS_UPDATED">עדכון הגדרות</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">סוג משאב</label>
              <select
                value={filters.resource_type}
                onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="all">כל הסוגים</option>
                <option value="product">מוצר</option>
                <option value="order">הזמנה</option>
                <option value="user">משתמש</option>
                <option value="settings">הגדרות</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ID משתמש</label>
              <input
                type="number"
                value={filters.user_id}
                onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
                placeholder="סנן לפי משתמש"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">מתאריך</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">עד תאריך</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">חיפוש</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="חפש בלוגים"
                  className="w-full px-4 py-2 pr-10 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתמש</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משאב</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פרטים</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                      אין לוגים להצגה
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-zinc-400" />
                          <span className="text-sm text-zinc-300">
                            {new Date(log.created_at).toLocaleString('he-IL')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-zinc-400" />
                          <div>
                            <div className="text-white text-sm">{log.user_email}</div>
                            <div className="text-xs text-zinc-400">ID: {log.user_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-zinc-300 text-sm">{log.resource_type}</span>
                          <div className="text-xs text-zinc-400">ID: {log.resource_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <span className="text-zinc-300 text-sm line-clamp-2">
                            {JSON.stringify(log.details).substring(0, 100)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-zinc-400">
                          {log.ip_address || '-'}
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

