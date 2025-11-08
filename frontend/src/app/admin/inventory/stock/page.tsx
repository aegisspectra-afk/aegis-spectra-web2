/**
 * Admin Inventory Stock Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Save, Search } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Product {
  id: number;
  sku: string;
  name: string;
  stock: number;
  price: number;
}

export default function AdminInventoryStockPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchProducts(token);
  }, [router]);

  const fetchProducts = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok && data.products) {
        setProducts(data.products);
      } else {
        showToast('שגיאה בטעינת מוצרים', 'error');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('שגיאה בטעינת מוצרים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (productId: number, newStock: number) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: newStock,
    }));
  };

  const handleSaveStock = async (productId: number) => {
    const newStock = stockUpdates[productId];
    if (newStock === undefined) return;

    setUpdating(productId);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const data = await res.json();
      
      if (data.ok) {
        showToast('מלאי עודכן בהצלחה', 'success');
        setStockUpdates(prev => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
        fetchProducts(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון מלאי', 'error');
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      showToast('שגיאה בעדכון מלאי', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-4xl font-bold mb-2">עדכון מלאי</h1>
          <p className="text-zinc-400">עדכן כמות מוצרים במלאי</p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
          <input
            type="text"
            placeholder="חפש מוצר..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/30 border border-zinc-700 rounded-xl px-12 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
          />
        </div>

        {/* Products Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">SKU</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם מוצר</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מלאי נוכחי</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מלאי חדש</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredProducts.map((product) => {
                  const newStock = stockUpdates[product.id] !== undefined 
                    ? stockUpdates[product.id] 
                    : product.stock || 0;
                  
                  return (
                    <tr key={product.id} className="hover:bg-zinc-900/30 transition">
                      <td className="px-6 py-4 text-zinc-300">{product.sku}</td>
                      <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${(product.stock || 0) <= 10 ? 'text-red-400' : 'text-green-400'}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={newStock}
                          onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                          className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold transition"
                        />
                      </td>
                      <td className="px-6 py-4">
                        {stockUpdates[product.id] !== undefined && (
                          <button
                            onClick={() => handleSaveStock(product.id)}
                            disabled={updating === product.id}
                            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition disabled:opacity-50"
                          >
                            <Save className="size-4" />
                            {updating === product.id ? 'שומר...' : 'שמור'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            לא נמצאו מוצרים
          </div>
        )}
      </div>
    </div>
  );
}

