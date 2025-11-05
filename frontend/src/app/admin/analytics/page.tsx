/**
 * Admin Analytics Dashboard Page
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, ShoppingCart, FileText, Users } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics/dashboard')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-zinc-400">טוען נתונים...</p>
          </div>
        </div>
      </div>
    );
  }

  const funnel = data?.funnel || {
    visits: 0,
    builderStarts: 0,
    quotesSubmitted: 0,
    conversions: 0,
    conversionRate: 0,
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">דשבורד אנליטיקה</h1>

        {/* Funnel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/30 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <Eye className="size-5 text-blue-400" />
                <span className="text-zinc-400">ביקורים</span>
              </div>
              <div className="text-3xl font-bold text-white">{funnel.visits.toLocaleString()}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/30 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileText className="size-5 text-yellow-400" />
                <span className="text-zinc-400">התחלות בונה</span>
              </div>
              <div className="text-3xl font-bold text-white">{funnel.builderStarts.toLocaleString()}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/30 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="size-5 text-green-400" />
                <span className="text-zinc-400">הצעות נשלחו</span>
              </div>
              <div className="text-3xl font-bold text-white">{funnel.quotesSubmitted.toLocaleString()}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/30 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="size-5 text-gold" />
                <span className="text-zinc-400">המרות</span>
              </div>
              <div className="text-3xl font-bold text-white">{funnel.conversions.toLocaleString()}</div>
              <div className="text-sm text-zinc-400 mt-1">
                {funnel.conversionRate.toFixed(2)}% שיעור המרה
              </div>
            </motion.div>
        </div>

        {/* Top Packages */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">החבילות הפופולריות</h2>
            <div className="space-y-4">
              {data?.topPackages?.length > 0 ? (
                data.topPackages.map((pkg: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{pkg.slug}</div>
                      <div className="text-sm text-zinc-400">{pkg.quotes} הצעות</div>
                    </div>
                    <div className="text-gold font-bold">{pkg.views.toLocaleString()} צפיות</div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400 text-center py-8">אין נתונים</p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

