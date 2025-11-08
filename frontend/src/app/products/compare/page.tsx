'use client';

import { useState, useEffect } from 'react';
import { Package, X, Plus } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  sku: string;
  image?: string;
  features?: string[];
}

export default function ProductComparePage() {
  const { showToast } = useToastContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.ok) {
        setAllProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('שגיאה בטעינת מוצרים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product: Product) => {
    if (products.length >= 4) {
      showToast('ניתן להשוות עד 4 מוצרים', 'error');
      return;
    }
    if (products.find(p => p.id === product.id)) {
      showToast('המוצר כבר ברשימת ההשוואה', 'error');
      return;
    }
    setProducts([...products, product]);
  };

  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
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
            <Package className="size-8 text-gold" />
            השוואת מוצרים
          </h1>
          <p className="text-zinc-400">השווה בין מוצרים כדי לבחור את המתאים ביותר</p>
        </div>

        {/* Add Products */}
        {products.length < 4 && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">הוסף מוצר להשוואה</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allProducts
                .filter(p => !products.find(prod => prod.id === p.id))
                .slice(0, 8)
                .map((product) => (
                  <div key={product.id} className="bg-zinc-900 rounded-lg p-4">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-white font-semibold mb-2 text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-gold font-bold mb-3">{product.price.toLocaleString('he-IL')} ₪</p>
                    <button
                      onClick={() => handleAddProduct(product)}
                      className="w-full px-3 py-2 bg-gold text-black rounded-lg text-sm font-semibold hover:bg-gold/90 transition flex items-center justify-center gap-2"
                    >
                      <Plus className="size-4" />
                      הוסף להשוואה
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {products.length > 0 && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תכונה</th>
                    {products.map((product) => (
                      <th key={product.id} className="px-6 py-4 text-right text-sm font-semibold text-zinc-300 relative">
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="absolute top-2 left-2 text-zinc-400 hover:text-white transition"
                        >
                          <X className="size-4" />
                        </button>
                        <div className="mt-6">
                          <img
                            src={product.image || '/placeholder.png'}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                          />
                          <p className="text-white font-semibold">{product.name}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-6 py-4 font-semibold text-zinc-300">מחיר</td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4">
                        <span className="text-gold font-bold">
                          {product.price.toLocaleString('he-IL')} ₪
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-zinc-300">SKU</td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4">
                        <span className="text-zinc-300">{product.sku}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-zinc-300">תיאור</td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4">
                        <span className="text-zinc-300 text-sm line-clamp-3">
                          {product.description || '-'}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {products.length === 0 && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-12 text-center">
            <Package className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין מוצרים להשוואה</p>
            <p className="text-zinc-500 text-sm mt-2">הוסף מוצרים מהרשימה למעלה</p>
          </div>
        )}
      </div>
    </div>
  );
}

