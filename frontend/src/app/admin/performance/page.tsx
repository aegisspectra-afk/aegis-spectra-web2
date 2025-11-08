'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gauge, TrendingUp, Clock, HardDrive, Zap, Activity } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface PerformanceMetrics {
  response_time: number;
  database_queries: number;
  cache_hit_rate: number;
  error_rate: number;
  active_users: number;
  server_load: number;
}

export default function AdminPerformancePage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    response_time: 0,
    database_queries: 0,
    cache_hit_rate: 0,
    error_rate: 0,
    active_users: 0,
    server_load: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchMetrics(token);
    const interval = setInterval(() => fetchMetrics(token), 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [router]);

  const fetchMetrics = async (token: string) => {
    try {
      const res = await fetch('/api/admin/performance', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setMetrics(data.metrics || metrics);
      } else {
        showToast(data.error || 'שגיאה בטעינת מדדי ביצועים', 'error');
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      showToast('שגיאה בטעינת מדדי ביצועים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, threshold: number, reverse = false) => {
    if (reverse) {
      return value < threshold ? 'text-green-400' : value > threshold * 1.5 ? 'text-red-400' : 'text-yellow-400';
    }
    return value < threshold ? 'text-green-400' : value > threshold * 1.5 ? 'text-red-400' : 'text-yellow-400';
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
            <Gauge className="size-8 text-gold" />
            ניהול ביצועים
          </h1>
          <p className="text-zinc-400">מעקב אחר ביצועי המערכת</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="size-8 text-blue-400" />
              <span className={`text-3xl font-bold ${getStatusColor(metrics.response_time, 200)}`}>
                {metrics.response_time}ms
              </span>
            </div>
            <p className="text-zinc-400 text-sm">זמן תגובה ממוצע</p>
            <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 transition-all"
                style={{ width: `${Math.min((metrics.response_time / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="size-8 text-green-400" />
              <span className={`text-3xl font-bold ${getStatusColor(metrics.database_queries, 100, true)}`}>
                {metrics.database_queries}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">שאילתות DB/דקה</p>
            <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all"
                style={{ width: `${Math.min((metrics.database_queries / 200) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="size-8 text-yellow-400" />
              <span className={`text-3xl font-bold ${getStatusColor(metrics.cache_hit_rate, 80, true)}`}>
                {metrics.cache_hit_rate}%
              </span>
            </div>
            <p className="text-zinc-400 text-sm">Cache Hit Rate</p>
            <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${metrics.cache_hit_rate}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="size-8 text-red-400" />
              <span className={`text-3xl font-bold ${getStatusColor(metrics.error_rate, 1)}`}>
                {metrics.error_rate}%
              </span>
            </div>
            <p className="text-zinc-400 text-sm">שיעור שגיאות</p>
            <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 transition-all"
                style={{ width: `${Math.min(metrics.error_rate * 10, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="size-8 text-purple-400" />
              <span className="text-3xl font-bold text-white">{metrics.active_users}</span>
            </div>
            <p className="text-zinc-400 text-sm">משתמשים פעילים</p>
            <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 transition-all"
                style={{ width: `${Math.min((metrics.active_users / 100) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <HardDrive className="size-8 text-orange-400" />
              <span className={`text-3xl font-bold ${getStatusColor(metrics.server_load, 70)}`}>
                {metrics.server_load}%
              </span>
            </div>
            <p className="text-zinc-400 text-sm">עומס שרת</p>
            <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 transition-all"
                style={{ width: `${metrics.server_load}%` }}
              />
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">המלצות לשיפור ביצועים</h2>
          <ul className="space-y-2 text-zinc-300">
            {metrics.response_time > 500 && (
              <li>• זמן תגובה גבוה - שקול לבדוק את אופטימיזציית השאילתות</li>
            )}
            {metrics.cache_hit_rate < 70 && (
              <li>• Cache Hit Rate נמוך - הגדל את גודל ה-cache</li>
            )}
            {metrics.error_rate > 2 && (
              <li>• שיעור שגיאות גבוה - בדוק את הלוגים לזיהוי בעיות</li>
            )}
            {metrics.server_load > 80 && (
              <li>• עומס שרת גבוה - שקול להגדיל את משאבי השרת</li>
            )}
            {metrics.database_queries > 150 && (
              <li>• מספר שאילתות גבוה - שקול לבדוק אופטימיזציה של שאילתות</li>
            )}
            {metrics.response_time < 200 && metrics.cache_hit_rate > 80 && metrics.error_rate < 1 && (
              <li className="text-green-400">✓ הביצועים טובים - המערכת פועלת בצורה מיטבית</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

