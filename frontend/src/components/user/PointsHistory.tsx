"use client";

import { useState, useEffect } from "react";
import { Gift, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";

interface PointsTransaction {
  id: string;
  type: "earned" | "redeemed" | "expired" | "bonus";
  points: number;
  description: string;
  order_id?: string;
  created_at: string;
}

interface PointsHistoryProps {
  userEmail?: string;
}

export function PointsHistory({ userEmail }: PointsHistoryProps) {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (userEmail) {
      fetchTransactions();
    }
  }, [userEmail, filter]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `/api/loyalty/transactions?user_email=${encodeURIComponent(userEmail || "")}&filter=${filter}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.ok && data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
      case "bonus":
        return <TrendingUp className="size-5 text-green-400" />;
      case "redeemed":
        return <TrendingDown className="size-5 text-red-400" />;
      case "expired":
        return <Calendar className="size-5 text-yellow-400" />;
      default:
        return <Gift className="size-5 text-zinc-400" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "earned":
        return "נצבר";
      case "redeemed":
        return "הוצא";
      case "expired":
        return "פג תוקף";
      case "bonus":
        return "בונוס";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען היסטוריה...</p>
        </div>
      </div>
    );
  }

  const filteredTransactions = filter === "all" 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Gift className="size-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">היסטוריית נקודות</h2>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold/70"
        >
          <option value="all">הכל</option>
          <option value="earned">נצבר</option>
          <option value="redeemed">הוצא</option>
          <option value="bonus">בונוס</option>
          <option value="expired">פג תוקף</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין היסטוריית נקודות</p>
          <p className="text-sm text-zinc-500">כל הפעולות בנקודות יופיעו כאן</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-xl border border-zinc-800 bg-black/20 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{transaction.description}</h3>
                      <span className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400">
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                    </div>
                    <div className={`font-bold ${
                      transaction.type === "earned" || transaction.type === "bonus"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}>
                      {transaction.type === "earned" || transaction.type === "bonus" ? "+" : "-"}
                      {transaction.points}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {new Date(transaction.created_at).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {transaction.order_id && (
                      <span className="text-xs text-zinc-600">
                        הזמנה #{transaction.order_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

