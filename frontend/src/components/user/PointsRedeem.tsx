"use client";

import { useState, useEffect } from "react";
import { Gift, ShoppingCart, Star, Check } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface RedeemableItem {
  id: string;
  name: string;
  description: string;
  points_required: number;
  category: string;
  image?: string;
}

interface PointsRedeemProps {
  userEmail?: string;
  availablePoints?: number;
}

export function PointsRedeem({ userEmail, availablePoints = 0 }: PointsRedeemProps) {
  const { showToast } = useToastContext();
  const [items, setItems] = useState<RedeemableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    fetchRedeemableItems();
  }, [category]);

  const fetchRedeemableItems = async () => {
    try {
      const response = await fetch(`/api/loyalty/redeem?category=${category}`);
      const data = await response.json();
      if (data.ok && data.items) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching redeemable items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (item: RedeemableItem) => {
    if (availablePoints < item.points_required) {
      showToast("אין לך מספיק נקודות", "error");
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          item_id: item.id,
          user_email: userEmail
        })
      });

      const data = await response.json();
      if (data.ok) {
        showToast("החלפה בוצעה בהצלחה!", "success");
        fetchRedeemableItems();
      } else {
        showToast(data.error || "שגיאה בהחלפה", "error");
      }
    } catch (error) {
      showToast("שגיאה בהחלפה", "error");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען קטלוג...</p>
        </div>
      </div>
    );
  }

  const filteredItems = category === "all" 
    ? items 
    : items.filter(item => item.category === category);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Gift className="size-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">החלפת נקודות</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/20 border border-gold/30">
          <Star className="size-5 text-gold" />
          <span className="font-bold text-gold">{availablePoints} נקודות זמינות</span>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
        >
          <option value="all">כל הקטגוריות</option>
          <option value="products">מוצרים</option>
          <option value="services">שירותים</option>
          <option value="discounts">הנחות</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין פריטים זמינים להחלפה</p>
          <p className="text-sm text-zinc-500">פריטים חדשים יופיעו כאן בקרוב</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-800 bg-black/20 p-6 hover:border-gold/50 transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <Gift className="size-6 text-gold" />
                <h3 className="font-semibold text-white">{item.name}</h3>
              </div>
              <p className="text-sm text-zinc-400 mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-yellow-400" />
                  <span className="font-bold text-white">{item.points_required} נקודות</span>
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={availablePoints < item.points_required}
                  className="px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {availablePoints >= item.points_required ? "החלף" : "לא מספיק"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

