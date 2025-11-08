'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Repeat, Search, Filter, Calendar, DollarSign, Pause, Play, X } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface RecurringOrder {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  frequency: string;
  next_order_date: string;
  total: number;
  status: string;
  created_at: string;
}

export default function AdminRecurringOrdersPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [orders, setOrders] = useState<RecurringOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFrequency, setFilterFrequency] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchOrders(token);
  }, [router, filterStatus, filterFrequency]);

  const fetchOrders = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterFrequency !== 'all') params.append('frequency', filterFrequency);

      const res = await fetch(`/api/admin/recurring-orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setOrders(data.orders || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת הזמנות חוזרות', 'error');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      showToast('שגיאה בטעינת הזמנות חוזרות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const newStatus = currentStatus === 'active' ? 'paused' : 'active';

      const res = await fetch(`/api/admin/recurring-orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(`הזמנה ${newStatus === 'active' ? 'הופעלה' : 'הושהתה'} בהצלחה`, 'success');
        fetchOrders(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון סטטוס', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('שגיאה בעדכון סטטוס', 'error');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך לבטל את ההזמנה החוזרת הזו?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/recurring-orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('הזמנה בוטלה בהצלחה', 'success');
        fetchOrders(token);
      } else {
        showToast(data.error || 'שגיאה בביטול הזמנה', 'error');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      showToast('שגיאה בביטול הזמנה', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-zinc-500/20 text-zinc-400';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      weekly: 'שבועי',
      biweekly: 'דו-שבועי',
      monthly: 'חודשי',
      quarterly: 'רבעוני',
      yearly: 'שנתי',
    };
    return labels[frequency] || frequency;
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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Repeat className="size-8 text-gold" />
            ניהול הזמנות חוזרות
          </h1>
          <p className="text-zinc-400">מעקב וניהול הזמנות חוזרות</p>
        </div>

        {/* Filters */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">סטטוס</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="paused">מושהה</option>
                <option value="cancelled">בוטל</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">תדירות</label>
              <select
                value={filterFrequency}
                onChange={(e) => setFilterFrequency(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="all">כל התדירויות</option>
                <option value="weekly">שבועי</option>
                <option value="biweekly">דו-שבועי</option>
                <option value="monthly">חודשי</option>
                <option value="quarterly">רבעוני</option>
                <option value="yearly">שנתי</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מספר הזמנה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">לקוח</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תדירות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הזמנה הבאה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סכום</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      אין הזמנות חוזרות להצגה
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={`/admin/orders/${order.order_id}`}
                          className="text-gold hover:text-gold/80 transition"
                        >
                          {order.order_id}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{order.customer_name}</div>
                        <div className="text-sm text-zinc-400">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{getFrequencyLabel(order.frequency)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-zinc-400" />
                          <span className="text-zinc-300">
                            {new Date(order.next_order_date).toLocaleDateString('he-IL')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4 text-zinc-400" />
                          <span className="text-white font-semibold">
                            {order.total.toLocaleString('he-IL')} ₪
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                          {order.status === 'active' ? 'פעיל' :
                           order.status === 'paused' ? 'מושהה' : 'בוטל'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(order.id, order.status)}
                                className={`px-3 py-1 rounded text-sm font-semibold transition ${
                                  order.status === 'active'
                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {order.status === 'active' ? (
                                  <>
                                    <Pause className="size-4 inline mr-1" />
                                    השהה
                                  </>
                                ) : (
                                  <>
                                    <Play className="size-4 inline mr-1" />
                                    הפעל
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition"
                              >
                                <X className="size-4 inline mr-1" />
                                בטל
                              </button>
                            </>
                          )}
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

