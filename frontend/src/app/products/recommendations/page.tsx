'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Package } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  sku: string;
  category?: string;
}

export default function ProductRecommendationsPage() {
  const { showToast } = useToastContext();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products/recommendations', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (data.ok) {
        setRecommendations(data.products || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת המלצות', 'error');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      showToast('שגיאה בטעינת המלצות', 'error');
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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="size-8 text-gold" />
            המלצות מותאמות אישית
          </h1>
          <p className="text-zinc-400">מוצרים מותאמים במיוחד עבורך</p>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-12 text-center">
            <Sparkles className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין המלצות זמינות כרגע</p>
            <p className="text-zinc-500 text-sm mt-2">המלצות יופיעו בהתבסס על הרכישות והצפיות שלך</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.sku}`}
                className="bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="aspect-square relative">
                  <img
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-gold text-black px-2 py-1 rounded text-xs font-semibold">
                    מומלץ
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  {product.category && (
                    <p className="text-zinc-400 text-sm mb-2">{product.category}</p>
                  )}
                  <p className="text-gold font-bold text-lg">
                    {product.price.toLocaleString('he-IL')} ₪
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

