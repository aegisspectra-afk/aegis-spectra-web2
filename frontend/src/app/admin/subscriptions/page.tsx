'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Search, Filter, Calendar, DollarSign, Pause, Play, X, CheckCircle } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Subscription {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  plan_name: string;
  price: number;
  billing_cycle: string;
  status: string;
  next_billing_date: string;
  created_at: string;
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSubscriptions(token);
  }, [router, filterStatus, filterPlan]);

  const fetchSubscriptions = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPlan !== 'all') params.append('plan', filterPlan);

      const res = await fetch(`/api/admin/subscriptions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setSubscriptions(data.subscriptions || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת מנויים', 'error');
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      showToast('שגיאה בטעינת מנויים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const newStatus = currentStatus === 'active' ? 'paused' : 'active';

      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(`מנוי ${newStatus === 'active' ? 'הופעל' : 'הושהה'} בהצלחה`, 'success');
        fetchSubscriptions(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון סטטוס', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('שגיאה בעדכון סטטוס', 'error');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך לבטל את המנוי הזה?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('מנוי בוטל בהצלחה', 'success');
        fetchSubscriptions(token);
      } else {
        showToast(data.error || 'שגיאה בביטול מנוי', 'error');
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      showToast('שגיאה בביטול מנוי', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'expired': return 'bg-zinc-500/20 text-zinc-400';
      default: return 'bg-zinc-500/20 text-zinc-400';
    }
  };

  const getBillingCycleLabel = (cycle: string) => {
    const labels: Record<string, string> = {
      monthly: 'חודשי',
      quarterly: 'רבעוני',
      yearly: 'שנתי',
    };
    return labels[cycle] || cycle;
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
            ניהול מנויים
          </h1>
          <p className="text-zinc-400">מעקב וניהול מנויים</p>
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
                <option value="expired">פג תוקף</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">תוכנית</label>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="all">כל התוכניות</option>
                <option value="basic">בסיסי</option>
                <option value="premium">פרימיום</option>
                <option value="enterprise">ארגוני</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתמש</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תוכנית</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מחיר</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מחזור חיוב</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">חיוב הבא</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      אין מנויים להצגה
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white">{subscription.user_name}</div>
                        <div className="text-sm text-zinc-400">{subscription.user_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">{subscription.plan_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4 text-zinc-400" />
                          <span className="text-white font-semibold">
                            {subscription.price.toLocaleString('he-IL')} ₪
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{getBillingCycleLabel(subscription.billing_cycle)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-zinc-400" />
                          <span className="text-zinc-300">
                            {new Date(subscription.next_billing_date).toLocaleDateString('he-IL')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(subscription.status)}`}>
                          {subscription.status === 'active' ? 'פעיל' :
                           subscription.status === 'paused' ? 'מושהה' :
                           subscription.status === 'cancelled' ? 'בוטל' : 'פג תוקף'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {subscription.status !== 'cancelled' && subscription.status !== 'expired' && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(subscription.id, subscription.status)}
                                className={`px-3 py-1 rounded text-sm font-semibold transition ${
                                  subscription.status === 'active'
                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {subscription.status === 'active' ? (
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
                                onClick={() => handleCancel(subscription.id)}
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

