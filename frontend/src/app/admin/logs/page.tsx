/**
 * Admin Audit Logs Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { History, Search, Filter, Download, User, Package, ShoppingCart, Settings } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface AuditLog {
  id: number;
  user_id: number;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id?: number | string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const actionIcons: Record<string, any> = {
  user: User,
  product: Package,
  order: ShoppingCart,
  package: Package,
  settings: Settings,
};

export default function AdminLogsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    resourceType: '',
    startDate: '',
    endDate: '',
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
      if (filters.action) params.append('action', filters.action);
      if (filters.resourceType) params.append('resource_type', filters.resourceType);
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      params.append('limit', '100');

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleExport = () => {
    const csv = [
      ['תאריך', 'משתמש', 'פעולה', 'סוג משאב', 'מזהה', 'פרטים', 'IP'].join(','),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString('he-IL'),
        log.user_email,
        log.action,
        log.resource_type,
        log.resource_id || '',
        JSON.stringify(log.details || {}),
        log.ip_address || '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('לוגים יוצאו בהצלחה', 'success');
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      user_created: 'יצירת משתמש',
      user_updated: 'עדכון משתמש',
      user_deleted: 'מחיקת משתמש',
      user_login: 'התחברות',
      user_logout: 'התנתקות',
      product_created: 'יצירת מוצר',
      product_updated: 'עדכון מוצר',
      product_deleted: 'מחיקת מוצר',
      order_created: 'יצירת הזמנה',
      order_updated: 'עדכון הזמנה',
      order_status_changed: 'שינוי סטטוס הזמנה',
      package_created: 'יצירת חבילה',
      package_updated: 'עדכון חבילה',
      stock_updated: 'עדכון מלאי',
      settings_updated: 'עדכון הגדרות',
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold mb-2">יומן פעילות</h1>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
            >
              <Download className="size-5" />
              ייצא ל-CSV
            </button>
          </div>
          <p className="text-zinc-400">מעקב אחר כל הפעולות במערכת</p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
          >
            <option value="">כל הפעולות</option>
            <option value="user_created">יצירת משתמש</option>
            <option value="user_updated">עדכון משתמש</option>
            <option value="product_created">יצירת מוצר</option>
            <option value="product_updated">עדכון מוצר</option>
            <option value="order_created">יצירת הזמנה</option>
            <option value="order_status_changed">שינוי סטטוס</option>
          </select>

          <select
            value={filters.resourceType}
            onChange={(e) => setFilters({ ...filters, resourceType: e.target.value })}
            className="bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
          >
            <option value="">כל הסוגים</option>
            <option value="user">משתמשים</option>
            <option value="product">מוצרים</option>
            <option value="order">הזמנות</option>
            <option value="package">חבילות</option>
            <option value="settings">הגדרות</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
            placeholder="מתאריך"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
            placeholder="עד תאריך"
          />
        </div>

        {/* Logs Table */}
        {logs.length > 0 ? (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתמש</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולה</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סוג משאב</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פרטים</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {logs.map((log) => {
                    const Icon = actionIcons[log.resource_type] || History;
                    return (
                      <tr key={log.id} className="hover:bg-zinc-900/30 transition">
                        <td className="px-6 py-4 text-zinc-300 text-sm">
                          {new Date(log.created_at).toLocaleString('he-IL')}
                        </td>
                        <td className="px-6 py-4 text-white">{log.user_email}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs bg-zinc-700 text-zinc-300 rounded-full">
                            {getActionLabel(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icon className="size-4 text-zinc-400" />
                            <span className="text-zinc-300">{log.resource_type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">
                          {log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : '-'}
                        </td>
                        <td className="px-6 py-4 text-zinc-500 text-xs">{log.ip_address || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-black/30 border border-zinc-800 rounded-xl">
            <History className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין לוגים זמינים</p>
          </div>
        )}
      </div>
    </div>
  );
}

