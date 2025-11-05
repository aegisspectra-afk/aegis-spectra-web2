"use client";

import { useState, useEffect } from "react";
import { Tag, CheckCircle, XCircle } from "lucide-react";

interface LoyaltyCouponsProps {
  userEmail?: string;
  onCouponSelected?: (coupon: Coupon) => void;
  selectedCoupon?: string | null;
}

interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  valid_until?: string;
  status: string;
}

export function LoyaltyCoupons({ userEmail, onCouponSelected, selectedCoupon }: LoyaltyCouponsProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userEmail) {
      fetchCoupons();
    }
  }, [userEmail]);

  const fetchCoupons = async () => {
    if (!userEmail) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty/coupons?user_email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();

      if (data.ok && data.coupons) {
        const activeCoupons = data.coupons.filter(
          (c: Coupon) => c.status === "active" && (!c.valid_until || new Date(c.valid_until) > new Date())
        );
        setCoupons(activeCoupons);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCoupon = (coupon: Coupon) => {
    if (onCouponSelected) {
      onCouponSelected(coupon);
    }
  };

  if (!userEmail || loading || coupons.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="text-cyan-400" size={20} />
        <h3 className="font-semibold text-white">קופונים אישיים</h3>
      </div>

      <div className="space-y-2">
        {coupons.map((coupon) => {
          const isSelected = selectedCoupon === coupon.code;
          const isValid = !coupon.valid_until || new Date(coupon.valid_until) > new Date();

          return (
            <button
              key={coupon.id}
              onClick={() => handleSelectCoupon(coupon)}
              disabled={!isValid}
              className={`w-full text-right p-3 rounded-lg border transition-colors ${
                isSelected
                  ? "bg-cyan-900/30 border-cyan-500"
                  : isValid
                  ? "bg-gray-700 border-gray-600 hover:border-cyan-500"
                  : "bg-gray-700/50 border-gray-700 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right">
                  <p className="font-semibold text-white">{coupon.code}</p>
                  <p className="text-sm text-gray-400">
                    {coupon.discount_type === "percentage"
                      ? `${coupon.discount_value}% הנחה`
                      : `₪${coupon.discount_value} הנחה`}
                    {coupon.min_purchase && ` • מינימום ₪${coupon.min_purchase}`}
                  </p>
                  {coupon.valid_until && (
                    <p className="text-xs text-gray-500 mt-1">
                      תקף עד: {new Date(coupon.valid_until).toLocaleDateString("he-IL")}
                    </p>
                  )}
                </div>
                {isSelected ? (
                  <CheckCircle className="text-cyan-400 flex-shrink-0 ml-3" size={20} />
                ) : isValid ? (
                  <Tag className="text-gray-400 flex-shrink-0 ml-3" size={20} />
                ) : (
                  <XCircle className="text-gray-500 flex-shrink-0 ml-3" size={20} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

