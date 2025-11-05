"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Package, ShoppingCart, MessageSquare, TrendingUp, AlertTriangle, Users, DollarSign, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useToastContext } from "@/components/ToastProvider";

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeTickets: number;
  lowStockAlerts: number;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  salesByDay: Array<{ date: string; sales: number; revenue: number }>;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [authenticated, setAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("admin_token") || 
                  document.cookie.split('; ').find(row => row.startsWith('admin_token='))?.split('=')[1];

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.ok && data.user) {
        setAdminUser(data.user);
        setAuthenticated(true);
        fetchStats(token);
      } else {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Auth check error:", err);
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
    showToast("התנתקת בהצלחה", "success");
  };

  const fetchStats = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analytics/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.ok) {
        setStats(data.stats || data.dashboard);
      } else {
        setError(data.error || "שגיאה בטעינת נתונים");
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("שגיאה בטעינת נתונים");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">דשבורד מנהל</h1>
            <p className="text-gray-400">סקירה כללית של העסק</p>
            {adminUser && (
              <div className="flex items-center gap-2 mt-2">
                <User size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">
                  {adminUser.name} ({adminUser.role})
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const token = localStorage.getItem("admin_token");
                if (token) fetchStats(token);
              }}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              רענן נתונים
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              התנתק
            </button>
          </div>
        </div>

        {loading && !stats && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-green-400" size={24} />
                  <span className="text-2xl font-bold text-white">{stats.totalRevenue.toLocaleString("he-IL")} ₪</span>
                </div>
                <p className="text-gray-400 text-sm">סה&quot;כ הכנסות</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="text-blue-400" size={24} />
                  <span className="text-2xl font-bold text-white">{stats.totalOrders}</span>
                </div>
                <p className="text-gray-400 text-sm">סה&quot;כ הזמנות</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-purple-400" size={24} />
                  <span className="text-2xl font-bold text-white">{stats.totalCustomers}</span>
                </div>
                <p className="text-gray-400 text-sm">לקוחות</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="text-yellow-400" size={24} />
                  <span className="text-2xl font-bold text-white">{stats.lowStockAlerts}</span>
                </div>
                <p className="text-gray-400 text-sm">התראות מלאי</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link
                href="/admin/packages"
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
              >
                <Package className="text-cyan-400 mb-3" size={32} />
                <h3 className="font-semibold text-white mb-1">ניהול חבילות</h3>
                <p className="text-gray-400 text-sm">ערוך, עדכן, נהל חבילות</p>
              </Link>

              <Link
                href="/admin/products"
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
              >
                <ShoppingCart className="text-cyan-400 mb-3" size={32} />
                <h3 className="font-semibold text-white mb-1">ניהול מוצרים</h3>
                <p className="text-gray-400 text-sm">עקוב אחר מוצרים, עדכן מלאי</p>
              </Link>

              <Link
                href="/admin/users"
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
              >
                <MessageSquare className="text-cyan-400 mb-3" size={32} />
                <h3 className="font-semibold text-white mb-1">ניהול משתמשים</h3>
                <p className="text-gray-400 text-sm">הרשאות, תפקידים, ניהול</p>
              </Link>

              <Link
                href="/admin/analytics"
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
              >
                <BarChart3 className="text-cyan-400 mb-3" size={32} />
                <h3 className="font-semibold text-white mb-1">אנליטיקה</h3>
                <p className="text-gray-400 text-sm">דוחות מפורטים, טרנדים</p>
              </Link>
            </div>

            {/* Top Products */}
            {stats.topProducts && stats.topProducts.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
                <h2 className="text-xl font-bold mb-4">מוצרים מובילים</h2>
                <div className="space-y-3">
                  {stats.topProducts.slice(0, 5).map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.sales} מכירות</p>
                      </div>
                      <p className="text-gold font-bold">{product.revenue.toLocaleString("he-IL")} ₪</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
