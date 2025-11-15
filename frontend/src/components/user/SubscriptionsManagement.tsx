"use client";

import { useState, useEffect } from "react";
import { CreditCard, ArrowUp, ArrowDown, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface Subscription {
  id: string;
  plan_name: string;
  plan_type: "basic" | "pro" | "enterprise";
  status: "active" | "cancelled" | "expired" | "pending";
  price: number;
  billing_cycle: "monthly" | "yearly";
  start_date: string;
  end_date?: string;
  next_billing_date?: string;
  features: string[];
}

interface SubscriptionsManagementProps {
  userEmail?: string;
}

export function SubscriptionsManagement({ userEmail }: SubscriptionsManagementProps) {
  const { showToast } = useToastContext();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      fetchSubscriptions();
    }
  }, [userEmail]);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `/api/user/subscriptions?user_email=${encodeURIComponent(userEmail || "")}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.ok && data.subscriptions) {
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (subscriptionId: string, newPlan: string) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/subscriptions/${subscriptionId}/upgrade`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan: newPlan })
      });

      const data = await response.json();
      if (data.ok) {
        showToast("תוכנית עודכנה בהצלחה", "success");
        fetchSubscriptions();
      } else {
        showToast(data.error || "שגיאה בעדכון תוכנית", "error");
      }
    } catch (error) {
      showToast("שגיאה בעדכון תוכנית", "error");
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm("האם אתה בטוח שברצונך לבטל את המנוי?")) {
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (data.ok) {
        showToast("מנוי בוטל בהצלחה", "success");
        fetchSubscriptions();
      } else {
        showToast(data.error || "שגיאה בביטול מנוי", "error");
      }
    } catch (error) {
      showToast("שגיאה בביטול מנוי", "error");
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case "enterprise":
        return "text-purple-400 bg-purple-900/20 border-purple-500";
      case "pro":
        return "text-gold bg-gold/20 border-gold";
      case "basic":
        return "text-blue-400 bg-blue-900/20 border-blue-500";
      default:
        return "text-zinc-400 bg-zinc-800 border-zinc-700";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען מנויים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="size-6 text-gold" />
        <h2 className="text-2xl font-bold text-white">מנויים ותוכניות</h2>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין מנויים פעילים</p>
          <p className="text-sm text-zinc-500 mb-4">בחר תוכנית כדי להתחיל</p>
          <button className="px-6 py-3 rounded-xl bg-gold text-black font-semibold hover:bg-gold/90 transition">
            צפה בתוכניות
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className={`rounded-xl border p-6 ${getPlanColor(subscription.plan_type)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{subscription.plan_name}</h3>
                    {subscription.status === "active" ? (
                      <CheckCircle className="size-5 text-green-400" />
                    ) : (
                      <XCircle className="size-5 text-red-400" />
                    )}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {subscription.billing_cycle === "monthly" ? "חודשי" : "שנתי"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{subscription.price} ₪</div>
                  <div className="text-sm text-zinc-400">
                    {subscription.billing_cycle === "monthly" ? "לחודש" : "לשנה"}
                  </div>
                </div>
              </div>

              {subscription.features && subscription.features.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-zinc-300 mb-2">תכונות:</div>
                  <ul className="space-y-1">
                    {subscription.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-zinc-400 flex items-center gap-2">
                        <CheckCircle className="size-3 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="text-sm text-zinc-400">
                  {subscription.next_billing_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      תאריך חיוב הבא: {new Date(subscription.next_billing_date).toLocaleDateString("he-IL")}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {subscription.status === "active" && subscription.plan_type !== "enterprise" && (
                    <button
                      onClick={() => handleUpgrade(subscription.id, "pro")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/50 hover:bg-gold/20 transition text-sm"
                    >
                      <ArrowUp className="size-4" />
                      שדרג
                    </button>
                  )}
                  {subscription.status === "active" && (
                    <button
                      onClick={() => handleCancel(subscription.id)}
                      className="px-4 py-2 rounded-lg border border-red-500/50 hover:bg-red-500/20 transition text-sm text-red-400"
                    >
                      בטל מנוי
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

