/**
 * Admin Orders Management Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Filter, Eye, Download, Package } from 'lucide-react';
import Link from 'next/link';
import { useToastContext } from '@/components/ToastProvider';

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  items?: any[];
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchOrders(token);
  }, [router, statusFilter]);

  const fetchOrders = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setOrders(data.orders || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת הזמנות', 'error');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      showToast('שגיאה בטעינת הזמנות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      
      if (data.ok) {
        showToast('סטטוס עודכן בהצלחה', 'success');
        fetchOrders(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון סטטוס', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('שגיאה בעדכון סטטוס', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      shipped: 'bg-purple-500/20 text-purple-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-zinc-500/20 text-zinc-400';
  };

  const filteredOrders = orders.filter(order =>
    order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-4xl font-bold mb-2">ניהול הזמנות</h1>
          <p className="text-zinc-400">ניהול כל ההזמנות במערכת</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
            <input
              type="text"
              placeholder="חפש הזמנה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-zinc-700 rounded-xl px-12 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  statusFilter === status
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {status === 'all' ? 'הכל' : 
                 status === 'pending' ? 'ממתין' :
                 status === 'processing' ? 'בעיבוד' :
                 status === 'shipped' ? 'נשלח' :
                 status === 'delivered' ? 'נמסר' : 'בוטל'}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מספר הזמנה</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">לקוח</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סכום</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תשלום</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition">
                      <td className="px-6 py-4 text-white font-mono">{order.order_id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{order.customer_name}</div>
                          <div className="text-sm text-zinc-400">{order.customer_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gold font-semibold">
                        {order.total.toLocaleString()} ₪
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.order_status}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold border-0 ${getStatusColor(order.order_status)}`}
                        >
                          <option value="pending">ממתין</option>
                          <option value="processing">בעיבוד</option>
                          <option value="shipped">נשלח</option>
                          <option value="delivered">נמסר</option>
                          <option value="cancelled">בוטל</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          order.payment_status === 'paid' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.payment_status === 'paid' ? 'שולם' : 'ממתין'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-300 text-sm">
                        {new Date(order.created_at).toLocaleString('he-IL')}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.order_id}`}
                          className="p-2 text-zinc-400 hover:text-gold transition"
                          title="צפה בפרטים"
                        >
                          <Eye className="size-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-black/30 border border-zinc-800 rounded-xl">
            <ShoppingCart className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין הזמנות</p>
          </div>
        )}
      </div>
    </div>
  );
}

