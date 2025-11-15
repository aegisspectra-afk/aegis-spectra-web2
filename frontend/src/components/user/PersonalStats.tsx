"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Package, Gift, DollarSign, Calendar } from "lucide-react";

interface Stats {
  total_orders: number;
  total_spent: number;
  total_points: number;
  average_order_value: number;
  orders_this_month: number;
  points_this_month: number;
}

interface PersonalStatsProps {
  userEmail?: string;
}

export function PersonalStats({ userEmail }: PersonalStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      fetchStats();
    }
  }, [userEmail]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `/api/user/stats?user_email=${encodeURIComponent(userEmail || "")}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.ok && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען סטטיסטיקות...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-12">
          <TrendingUp className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400">אין נתונים להצגה</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="size-6 text-gold" />
        <h2 className="text-2xl font-bold text-white">סטטיסטיקות אישיות</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-black/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="size-5 text-blue-400" />
            <div className="text-sm text-zinc-400">סה"כ הזמנות</div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.total_orders}</div>
          <div className="text-xs text-zinc-500 mt-1">
            {stats.orders_this_month} החודש
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="size-5 text-green-400" />
            <div className="text-sm text-zinc-400">סה"כ הוצאות</div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.total_spent.toLocaleString()} ₪</div>
          <div className="text-xs text-zinc-500 mt-1">
            ממוצע: {stats.average_order_value.toLocaleString()} ₪
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="size-5 text-yellow-400" />
            <div className="text-sm text-zinc-400">נקודות נאמנות</div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.total_points}</div>
          <div className="text-xs text-zinc-500 mt-1">
            {stats.points_this_month} החודש
          </div>
        </div>
      </div>
    </div>
  );
}

