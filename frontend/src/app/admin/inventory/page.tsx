"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, TrendingUp, History } from "lucide-react";
import Link from "next/link";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "aegis2024";

interface InventoryAlert {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  status: string;
  created_at: string;
}

export default function AdminInventoryPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      fetchAlerts();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setError("סיסמה שגויה");
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/inventory/alerts", {
        headers: {
          Authorization: `Bearer ${ADMIN_PASSWORD}`,
        },
      });

      const data = await res.json();

      if (data.ok) {
        setAlerts(data.alerts || []);
      } else {
        setError(data.error || "שגיאה בטעינת התראות");
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("שגיאה בטעינת התראות");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h1 className="text-2xl font-bold mb-6 text-center">ניהול מלאי</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  סיסמת אדמין
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                התחבר
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">ניהול מלאי</h1>
            <p className="text-gray-400">התראות מלאי וניהול</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            חזרה לדשבורד
          </Link>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        )}

        {alerts.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-yellow-400" size={24} />
              <h2 className="text-xl font-bold">התראות מלאי נמוך</h2>
            </div>
            <div className="space-y-3">
              {alerts.filter(a => a.status === "active").map((alert) => (
                <div key={alert.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{alert.product_name}</p>
                      <p className="text-sm text-gray-400">SKU: {alert.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">מלאי: {alert.current_stock}</p>
                      <p className="text-sm text-gray-400">מינימום: {alert.min_stock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/inventory/stock"
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
          >
            <Package className="text-cyan-400 mb-3" size={32} />
            <h3 className="font-semibold text-white mb-1">עדכן מלאי</h3>
            <p className="text-gray-400 text-sm">עדכן כמות מוצרים</p>
          </Link>

          <Link
            href="/admin/inventory/alerts"
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
          >
            <AlertTriangle className="text-yellow-400 mb-3" size={32} />
            <h3 className="font-semibold text-white mb-1">התראות</h3>
            <p className="text-gray-400 text-sm">{alerts.filter(a => a.status === "active").length} פעילות</p>
          </Link>

          <Link
            href="/admin/inventory/history"
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
          >
            <History className="text-purple-400 mb-3" size={32} />
            <h3 className="font-semibold text-white mb-1">היסטוריה</h3>
            <p className="text-gray-400 text-sm">צפה בהיסטוריית מלאי</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

