/**
 * Admin Inventory History Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { History, Package, TrendingUp, TrendingDown } from 'lucide-react';

interface StockHistory {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  old_stock: number;
  new_stock: number;
  change_type: 'increase' | 'decrease' | 'set';
  changed_by: string;
  notes?: string;
  created_at: string;
}

export default function AdminInventoryHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchHistory(token);
  }, [router]);

  const fetchHistory = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setHistory(data.history || []);
      } else {
        console.error('Error fetching history:', data.error);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
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
          <h1 className="text-4xl font-bold mb-2">היסטוריית מלאי</h1>
          <p className="text-zinc-400">צפה בהיסטוריית שינויים במלאי</p>
        </div>

        {history.length > 0 ? (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מוצר</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">SKU</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מלאי קודם</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מלאי חדש</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שינוי</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שונה על ידי</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {history.map((item) => {
                    const change = item.new_stock - item.old_stock;
                    const isIncrease = change > 0;
                    
                    return (
                      <tr key={item.id} className="hover:bg-zinc-900/30 transition">
                        <td className="px-6 py-4 text-zinc-300 text-sm">
                          {new Date(item.created_at).toLocaleString('he-IL')}
                        </td>
                        <td className="px-6 py-4 text-white font-medium">{item.product_name}</td>
                        <td className="px-6 py-4 text-zinc-300">{item.sku}</td>
                        <td className="px-6 py-4 text-zinc-400">{item.old_stock}</td>
                        <td className="px-6 py-4 text-white font-semibold">{item.new_stock}</td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 ${
                            isIncrease ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {isIncrease ? (
                              <TrendingUp className="size-4" />
                            ) : (
                              <TrendingDown className="size-4" />
                            )}
                            <span className="font-semibold">
                              {isIncrease ? '+' : ''}{change}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300 text-sm">{item.changed_by}</td>
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
            <p className="text-zinc-400">אין היסטוריה זמינה</p>
          </div>
        )}
      </div>
    </div>
  );
}

