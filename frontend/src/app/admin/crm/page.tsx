'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, TrendingUp, Award, Gift, Calendar, DollarSign } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Customer {
  id: number;
  email: string;
  name: string;
  phone?: string;
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  loyalty_tier: string;
  last_order_date?: string;
  created_at: string;
}

export default function AdminCRMPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topCustomers: [] as Customer[],
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/crm/customers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setCustomers(data.customers || []);
        setStats(data.stats || stats);
      } else {
        showToast(data.error || 'שגיאה בטעינת נתוני CRM', 'error');
      }
    } catch (err) {
      console.error('Error fetching CRM data:', err);
      showToast('שגיאה בטעינת נתוני CRM', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'text-purple-400';
      case 'Gold': return 'text-yellow-400';
      case 'Silver': return 'text-gray-400';
      default: return 'text-zinc-400';
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
            <Users className="size-8 text-gold" />
            CRM - ניהול לקוחות
          </h1>
          <p className="text-zinc-400">מעקב אחר לקוחות, נאמנות והכנסות</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="size-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats.totalCustomers}</span>
            </div>
            <p className="text-zinc-400 text-sm">סה&quot;כ לקוחות</p>
          </div>
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="size-8 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {stats.totalRevenue.toLocaleString('he-IL')} ₪
              </span>
            </div>
            <p className="text-zinc-400 text-sm">סה&quot;כ הכנסות</p>
          </div>
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="size-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">
                {stats.averageOrderValue.toLocaleString('he-IL')} ₪
              </span>
            </div>
            <p className="text-zinc-400 text-sm">ערך הזמנה ממוצע</p>
          </div>
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="size-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                {customers.filter(c => c.loyalty_tier === 'Platinum').length}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">לקוחות Platinum</p>
          </div>
        </div>

        {/* Top Customers */}
        {stats.topCustomers.length > 0 && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className="size-6 text-gold" />
              לקוחות מובילים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.topCustomers.slice(0, 6).map((customer, idx) => (
                <div key={customer.id} className="bg-zinc-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gold font-bold">#{idx + 1}</span>
                    <span className={`text-sm font-semibold ${getTierColor(customer.loyalty_tier)}`}>
                      {customer.loyalty_tier}
                    </span>
                  </div>
                  <p className="font-semibold text-white">{customer.name}</p>
                  <p className="text-sm text-zinc-400">{customer.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      {customer.total_spent.toLocaleString('he-IL')} ₪
                    </span>
                    <span className="text-xs text-zinc-400">
                      {customer.total_orders} הזמנות
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">לקוח</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הזמנות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סה&quot;כ הוצאה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">נקודות נאמנות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">דרגה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הזמנה אחרונה</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                      אין לקוחות להצגה
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{customer.name}</div>
                        <div className="text-sm text-zinc-400">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-xs text-zinc-500">{customer.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{customer.total_orders}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">
                          {customer.total_spent.toLocaleString('he-IL')} ₪
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Gift className="size-4 text-yellow-400" />
                          <span className="text-white">{customer.loyalty_points}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${getTierColor(customer.loyalty_tier)}`}>
                          {customer.loyalty_tier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {customer.last_order_date
                            ? new Date(customer.last_order_date).toLocaleDateString('he-IL')
                            : 'אין הזמנות'}
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

