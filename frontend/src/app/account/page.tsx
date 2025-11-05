"use client";

import { useState, useEffect } from "react";
import { User, Package, Gift, Ticket, Star, Tag, ShoppingCart, History } from "lucide-react";
import Link from "next/link";

interface LoyaltyData {
  points: number;
  total_earned: number;
  total_spent: number;
  tier: string;
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

export default function AccountPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "loyalty" | "orders" | "tickets">("overview");

  useEffect(() => {
    // Get user email from localStorage or session
    const email = localStorage.getItem("user_email") || sessionStorage.getItem("user_email");
    setUserEmail(email);

    if (email) {
      fetchAccountData(email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAccountData = async (email: string) => {
    setLoading(true);

    try {
      // Fetch loyalty points
      const loyaltyRes = await fetch(`/api/loyalty/points?user_email=${encodeURIComponent(email)}`);
      const loyaltyData = await loyaltyRes.json();
      if (loyaltyData.ok && loyaltyData.loyalty) {
        setLoyaltyData(loyaltyData.loyalty);
      }

      // Fetch coupons
      const couponsRes = await fetch(`/api/loyalty/coupons?user_email=${encodeURIComponent(email)}`);
      const couponsData = await couponsRes.json();
      if (couponsData.ok && couponsData.coupons) {
        setCoupons(couponsData.coupons);
      }

      // Fetch support tickets
      const ticketsRes = await fetch(`/api/support/tickets?user_email=${encodeURIComponent(email)}`);
      const ticketsData = await ticketsRes.json();
      if (ticketsData.ok && ticketsData.tickets) {
        setTickets(ticketsData.tickets);
      }
    } catch (err) {
      console.error("Error fetching account data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "text-purple-400 bg-purple-900/20 border-purple-500";
      case "Gold":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500";
      case "Silver":
        return "text-gray-300 bg-gray-800 border-gray-600";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };

  if (!userEmail) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <User className="text-gray-400 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-4">חשבון משתמש</h2>
            <p className="text-gray-400 mb-6">אנא התחבר כדי לראות את פרטי החשבון</p>
            <Link
              href="/register"
              className="inline-block px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              הרשמה / התחברות
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">חשבון משתמש</h1>
          <p className="text-gray-400">{userEmail}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {[
            { id: "overview", label: "סקירה", icon: User },
            { id: "loyalty", label: "נאמנות", icon: Star },
            { id: "orders", label: "הזמנות", icon: ShoppingCart },
            { id: "tickets", label: "תמיכה", icon: Ticket },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-cyan-500 text-cyan-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6">
                {loyaltyData && (
                  <div className={`rounded-lg p-6 border ${getTierColor(loyaltyData.tier)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-400" size={24} />
                        <h3 className="text-xl font-bold">נקודות נאמנות</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{loyaltyData.points}</p>
                        <p className="text-sm opacity-80">רמה: {loyaltyData.tier}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm opacity-80">סה"כ נצבר</p>
                        <p className="text-lg font-semibold">{loyaltyData.total_earned}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80">סה"כ הוצא</p>
                        <p className="text-lg font-semibold">{loyaltyData.total_spent}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    href="/account?tab=loyalty"
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
                  >
                    <Gift className="text-cyan-400 mb-3" size={32} />
                    <h3 className="font-semibold text-white mb-1">קופונים</h3>
                    <p className="text-gray-400 text-sm">{coupons.filter(c => c.status === "active").length} פעילים</p>
                  </Link>

                  <Link
                    href="/account?tab=orders"
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
                  >
                    <ShoppingCart className="text-cyan-400 mb-3" size={32} />
                    <h3 className="font-semibold text-white mb-1">הזמנות</h3>
                    <p className="text-gray-400 text-sm">{orders.length} הזמנות</p>
                  </Link>

                  <Link
                    href="/account?tab=tickets"
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors"
                  >
                    <Ticket className="text-cyan-400 mb-3" size={32} />
                    <h3 className="font-semibold text-white mb-1">כרטיסי תמיכה</h3>
                    <p className="text-gray-400 text-sm">{tickets.filter(t => t.status !== "closed").length} פתוחים</p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "loyalty" && (
              <div className="space-y-6">
                {loyaltyData && (
                  <div className={`rounded-lg p-6 border ${getTierColor(loyaltyData.tier)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">נקודות נאמנות</h3>
                        <p className="text-sm opacity-80">רמה: {loyaltyData.tier}</p>
                      </div>
                      <p className="text-4xl font-bold">{loyaltyData.points}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold mb-4">קופונים אישיים</h3>
                  {coupons.length > 0 ? (
                    <div className="space-y-3">
                      {coupons
                        .filter(c => c.status === "active")
                        .map((coupon) => (
                          <div
                            key={coupon.id}
                            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                          >
                            <div className="flex items-center justify-between">
                              <div>
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
                              <Tag className="text-cyan-400" size={24} />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">אין קופונים זמינים</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h3 className="text-xl font-bold mb-4">הזמנות שלי</h3>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">#{order.order_id}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(order.created_at).toLocaleDateString("he-IL")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gold">₪{order.total}</p>
                            <p className="text-sm text-gray-400">{order.order_status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">אין הזמנות</p>
                )}
              </div>
            )}

            {activeTab === "tickets" && (
              <div>
                <h3 className="text-xl font-bold mb-4">כרטיסי תמיכה</h3>
                {tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">#{ticket.ticket_number}</p>
                            <p className="text-sm text-gray-400">{ticket.subject}</p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded text-sm ${
                                ticket.status === "open"
                                  ? "bg-green-900/30 text-green-400"
                                  : ticket.status === "resolved"
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-gray-700 text-gray-400"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">אין כרטיסי תמיכה</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

