'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, DollarSign, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Payment {
  id: number;
  order_id: string;
  amount: number;
  method: string;
  status: string;
  transaction_id?: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchPayments(token);
  }, [router, filterStatus, filterMethod]);

  const fetchPayments = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterMethod !== 'all') params.append('method', filterMethod);

      const res = await fetch(`/api/admin/payments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setPayments(data.payments || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת תשלומים', 'error');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      showToast('שגיאה בטעינת תשלומים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId: number) => {
    if (!confirm('האם אתה בטוח שברצונך לבצע החזר לתשלום זה?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('החזר בוצע בהצלחה', 'success');
        fetchPayments(token);
      } else {
        showToast(data.error || 'שגיאה בביצוע החזר', 'error');
      }
    } catch (err) {
      console.error('Error processing refund:', err);
      showToast('שגיאה בביצוע החזר', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'refunded': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-zinc-500/20 text-zinc-400';
    }
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
            <CreditCard className="size-8 text-gold" />
            ניהול תשלומים
          </h1>
          <p className="text-zinc-400">מעקב וניהול תשלומים והחזרים</p>
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
                <option value="completed">הושלם</option>
                <option value="pending">ממתין</option>
                <option value="failed">נכשל</option>
                <option value="refunded">הוחזר</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">שיטת תשלום</label>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="all">כל השיטות</option>
                <option value="credit_card">כרטיס אשראי</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">העברה בנקאית</option>
                <option value="cash">מזומן</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מספר הזמנה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">לקוח</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סכום</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שיטה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מספר עסקה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-400">
                      אין תשלומים להצגה
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={`/admin/orders/${payment.order_id}`}
                          className="text-gold hover:text-gold/80 transition"
                        >
                          {payment.order_id}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{payment.customer_name}</div>
                        <div className="text-sm text-zinc-400">{payment.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">
                          {payment.amount.toLocaleString('he-IL')} ₪
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{payment.method}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(payment.status)}`}>
                          {payment.status === 'completed' ? 'הושלם' :
                           payment.status === 'pending' ? 'ממתין' :
                           payment.status === 'failed' ? 'נכשל' : 'הוחזר'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300 text-sm font-mono">
                          {payment.transaction_id || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {new Date(payment.created_at).toLocaleDateString('he-IL')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'completed' && (
                          <button
                            onClick={() => handleRefund(payment.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <RefreshCcw className="size-4" />
                            החזר
                          </button>
                        )}
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

