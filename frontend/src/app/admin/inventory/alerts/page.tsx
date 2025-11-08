/**
 * Admin Inventory Alerts Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface InventoryAlert {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  alert_type: string;
  status: string;
  notes?: string;
  created_at: string;
  resolved_at?: string;
}

export default function AdminInventoryAlertsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('active');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchAlerts(token);
  }, [router, statusFilter]);

  const fetchAlerts = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const res = await fetch(`/api/inventory/alerts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setAlerts(data.alerts || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת התראות', 'error');
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      showToast('שגיאה בטעינת התראות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch('/api/inventory/alerts', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: alertId,
          status: 'resolved',
        }),
      });

      const data = await res.json();
      
      if (data.ok) {
        showToast('התראה נפתרה', 'success');
        fetchAlerts(token);
      } else {
        showToast(data.error || 'שגיאה בפתרון התראה', 'error');
      }
    } catch (err) {
      console.error('Error resolving alert:', err);
      showToast('שגיאה בפתרון התראה', 'error');
    }
  };

  const filteredAlerts = alerts.filter(a => 
    statusFilter === 'all' || a.status === statusFilter
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">התראות מלאי</h1>
          <p className="text-zinc-400">ניהול התראות מלאי נמוך</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {(['all', 'active', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                statusFilter === status
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {status === 'all' ? 'הכל' : status === 'active' ? 'פעילות' : 'נפתרו'}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-black/30 border rounded-xl p-6 ${
                  alert.status === 'active' 
                    ? 'border-yellow-500/50 bg-yellow-900/10' 
                    : 'border-zinc-800 bg-zinc-900/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`rounded-full p-3 ${
                      alert.status === 'active' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {alert.status === 'active' ? (
                        <AlertTriangle className="size-6" />
                      ) : (
                        <CheckCircle className="size-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{alert.product_name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-400">SKU:</span>
                          <span className="text-white ml-2">{alert.sku}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">מלאי נוכחי:</span>
                          <span className={`font-bold ml-2 ${
                            alert.current_stock <= alert.min_stock ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {alert.current_stock}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-400">מינימום:</span>
                          <span className="text-white ml-2">{alert.min_stock}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">סוג התראה:</span>
                          <span className="text-white ml-2">{alert.alert_type}</span>
                        </div>
                      </div>
                      {alert.notes && (
                        <p className="text-zinc-400 text-sm mt-2">{alert.notes}</p>
                      )}
                      <p className="text-zinc-500 text-xs mt-2">
                        נוצר: {new Date(alert.created_at).toLocaleString('he-IL')}
                        {alert.resolved_at && ` • נפתר: ${new Date(alert.resolved_at).toLocaleString('he-IL')}`}
                      </p>
                    </div>
                  </div>
                  {alert.status === 'active' && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                    >
                      <CheckCircle className="size-4" />
                      פתור
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-black/30 border border-zinc-800 rounded-xl">
            <AlertTriangle className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין התראות</p>
          </div>
        )}
      </div>
    </div>
  );
}

