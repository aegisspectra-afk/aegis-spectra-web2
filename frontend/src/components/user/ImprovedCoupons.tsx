"use client";

import { useState, useEffect } from "react";
import { Tag, CheckCircle, XCircle, Clock, Copy, History } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  valid_until?: string;
  status: string;
  used_count?: number;
  usage_limit?: number;
}

interface CouponUsage {
  id: string;
  coupon_code: string;
  order_id?: string;
  used_at: string;
  discount_amount: number;
}

interface ImprovedCouponsProps {
  userEmail?: string;
}

export function ImprovedCoupons({ userEmail }: ImprovedCouponsProps) {
  const { showToast } = useToastContext();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [publicCoupons, setPublicCoupons] = useState<Coupon[]>([]);
  const [usageHistory, setUsageHistory] = useState<CouponUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "public" | "history">("personal");

  useEffect(() => {
    if (userEmail) {
      fetchCoupons();
      fetchUsageHistory();
    }
  }, [userEmail, activeTab]);

  const fetchCoupons = async () => {
    try {
      const personalRes = await fetch(`/api/loyalty/coupons?user_email=${encodeURIComponent(userEmail || "")}`);
      const personalData = await personalRes.json();
      if (personalData.ok && personalData.coupons) {
        setCoupons(personalData.coupons.filter((c: Coupon) => c.status === "active"));
      }

      const publicRes = await fetch(`/api/loyalty/coupons/public`);
      const publicData = await publicRes.json();
      if (publicData.ok && publicData.coupons) {
        setPublicCoupons(publicData.coupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `/api/loyalty/coupons/usage-history?user_email=${encodeURIComponent(userEmail || "")}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.ok && data.history) {
        setUsageHistory(data.history);
      }
    } catch (error) {
      console.error("Error fetching usage history:", error);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast("קוד הועתק!", "success");
  };

  const renderCoupon = (coupon: Coupon, isPublic: boolean = false) => {
    const isValid = !coupon.valid_until || new Date(coupon.valid_until) > new Date();
    const isAvailable = coupon.usage_limit ? (coupon.used_count || 0) < coupon.usage_limit : true;

    return (
      <div
        key={coupon.id}
        className={`rounded-xl border p-4 ${
          isValid && isAvailable
            ? "border-zinc-800 bg-black/20 hover:border-gold/50"
            : "border-zinc-800 bg-black/10 opacity-60"
        } transition`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="size-5 text-gold" />
              <span className="font-bold text-white text-lg">{coupon.code}</span>
              <button
                onClick={() => handleCopyCode(coupon.code)}
                className="p-1 hover:bg-zinc-800 rounded transition"
                title="העתק קוד"
              >
                <Copy className="size-4 text-zinc-400" />
              </button>
            </div>
            <p className="text-sm text-zinc-400 mb-2">
              {coupon.discount_type === "percentage"
                ? `${coupon.discount_value}% הנחה`
                : `₪${coupon.discount_value} הנחה`}
              {coupon.min_purchase && ` • מינימום ₪${coupon.min_purchase}`}
              {coupon.max_discount && ` • מקסימום ₪${coupon.max_discount}`}
            </p>
            {coupon.valid_until && (
              <p className="text-xs text-zinc-500">
                תקף עד: {new Date(coupon.valid_until).toLocaleDateString("he-IL")}
              </p>
            )}
            {coupon.usage_limit && (
              <p className="text-xs text-zinc-500 mt-1">
                שימוש: {coupon.used_count || 0} / {coupon.usage_limit}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            {isValid && isAvailable ? (
              <CheckCircle className="size-5 text-green-400" />
            ) : (
              <XCircle className="size-5 text-red-400" />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען קופונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Tag className="size-6 text-gold" />
        <h2 className="text-2xl font-bold text-white">קופונים</h2>
      </div>

      <div className="flex gap-2 mb-6 border-b border-zinc-800">
        {[
          { id: "personal" as const, label: "אישיים", icon: Tag },
          { id: "public" as const, label: "ציבוריים", icon: Tag },
          { id: "history" as const, label: "היסטוריה", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-zinc-400 hover:text-zinc-300"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "personal" && (
        <div className="space-y-3">
          {coupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="size-16 mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">אין קופונים אישיים</p>
            </div>
          ) : (
            coupons.map(coupon => renderCoupon(coupon, false))
          )}
        </div>
      )}

      {activeTab === "public" && (
        <div className="space-y-3">
          {publicCoupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="size-16 mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">אין קופונים ציבוריים זמינים</p>
            </div>
          ) : (
            publicCoupons.map(coupon => renderCoupon(coupon, true))
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          {usageHistory.length === 0 ? (
            <div className="text-center py-12">
              <History className="size-16 mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">אין היסטוריית שימוש</p>
            </div>
          ) : (
            usageHistory.map((usage) => (
              <div
                key={usage.id}
                className="rounded-xl border border-zinc-800 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{usage.coupon_code}</div>
                    <div className="text-sm text-zinc-400">
                      {usage.order_id && `הזמנה #${usage.order_id}`}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {new Date(usage.used_at).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-gold font-bold">
                    -{usage.discount_amount} ₪
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

