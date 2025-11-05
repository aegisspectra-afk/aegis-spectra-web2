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

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("אין הרשאה");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/inventory/alerts", {
        headers: {
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setAuthenticated(true);
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-zinc-400 mb-4">נדרשת התחברות</p>
            <a href="/admin/login" className="text-gold hover:text-gold/80">חזור לדף ההתחברות</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">ניהול מלאי</h1>
            <p className="text-gray-400">התראות מלאי וניהול</p>
          </div>
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
    </div>
  );
}

