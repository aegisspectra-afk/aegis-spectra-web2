"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, User, Phone, Mail, Calendar, Package, 
  MessageSquare, FileText, Settings, LogOut, Clock, CheckCircle, Download, Key, Save, Edit, X, Star, Gift, ShoppingCart, Ticket
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToastContext } from "@/components/ToastProvider";
import { trackProfileUpdate } from "@/lib/analytics";
import { LoyaltyPoints } from "@/components/Loyalty/LoyaltyPoints";
import { LoyaltyCoupons } from "@/components/Loyalty/LoyaltyCoupons";
import { TicketForm } from "@/components/Support/TicketForm";

type UserProfile = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
};

type Order = {
  id: number;
  product_sku: string;
  status: string;
  created_at: string;
  total: number;
};

function ProfileEditor({ user, onUpdate }: { user: UserProfile; onUpdate: (user: UserProfile) => void }) {
  const { showToast } = useToastContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || "",
    phone: user.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = (phone: string) => {
    if (!phone) return null;
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "מספר טלפון לא תקין";
    }
    return null;
  };

  const validateEmail = (email: string) => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "אימייל לא תקין";
    }
    return null;
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "שם מלא נדרש";
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.ok && data.user) {
        onUpdate({
          ...user,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });
        setIsEditing(false);
        setErrors({});
        showToast("פרופיל עודכן בהצלחה", "success");
        trackProfileUpdate();
        // Update localStorage
        if (data.user.name) localStorage.setItem("user_name", data.user.name);
        if (data.user.email) localStorage.setItem("user_email", data.user.email);
        if (data.user.phone) localStorage.setItem("user_phone", data.user.phone);
      } else {
        showToast(data.error || "שגיאה בעדכון פרופיל", "error");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      showToast("שגיאה בעדכון פרופיל", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">פרטים אישיים</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition text-sm sm:text-base"
          >
            <Edit className="size-4" />
            ערוך
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gold text-black px-4 py-2 hover:bg-gold/90 transition disabled:opacity-50 text-sm sm:text-base"
            >
              <Save className="size-4" />
              {saving ? "שומר..." : "שמור"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name,
                  email: user.email || "",
                  phone: user.phone || "",
                });
                setErrors({});
              }}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition text-sm sm:text-base"
            >
              <X className="size-4" />
              ביטול
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">שם מלא *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={`w-full bg-black/30 border rounded-lg px-4 py-3 focus:outline-none transition text-white text-sm sm:text-base ${
                errors.name ? "border-red-500" : "border-zinc-700 focus:border-gold/70"
              }`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">אימייל</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`w-full bg-black/30 border rounded-lg px-4 py-3 focus:outline-none transition text-white text-sm sm:text-base ${
                errors.email ? "border-red-500" : "border-zinc-700 focus:border-gold/70"
              }`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">טלפון</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: "" });
              }}
              className={`w-full bg-black/30 border rounded-lg px-4 py-3 focus:outline-none transition text-white text-sm sm:text-base ${
                errors.phone ? "border-red-500" : "border-zinc-700 focus:border-gold/70"
              }`}
              placeholder="050-123-4567"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-center gap-4">
            <User className="size-5 text-zinc-400 flex-shrink-0" />
            <div>
              <div className="text-sm text-zinc-400">שם מלא</div>
              <div className="text-white font-semibold text-sm sm:text-base">{user.name}</div>
            </div>
          </div>
          {user.email && (
            <div className="flex items-center gap-4">
              <Mail className="size-5 text-zinc-400 flex-shrink-0" />
              <div>
                <div className="text-sm text-zinc-400">אימייל</div>
                <div className="text-white font-semibold text-sm sm:text-base break-all">{user.email}</div>
              </div>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-4">
              <Phone className="size-5 text-zinc-400 flex-shrink-0" />
              <div>
                <div className="text-sm text-zinc-400">טלפון</div>
                <div className="text-white font-semibold text-sm sm:text-base">{user.phone}</div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Calendar className="size-5 text-zinc-400 flex-shrink-0" />
            <div>
              <div className="text-sm text-zinc-400">תאריך הצטרפות</div>
              <div className="text-white font-semibold text-sm sm:text-base">
                {new Date(user.created_at).toLocaleDateString("he-IL")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

interface SupportTicket {
  id: number;
  ticket_number: string;
  subject: string;
  status: string;
  created_at: string;
}

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "loyalty" | "orders" | "support" | "reports" | "api-keys">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify authentication with server
    const token = localStorage.getItem("user_token");
    
    if (!token) {
      // Redirect to login if not authenticated
      window.location.href = "/login?redirect=/user";
      return;
    }

    // Always verify token with server
    fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // Include cookies
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 401) {
          // Invalid token - clear localStorage and redirect
          localStorage.removeItem("user_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_email");
          localStorage.removeItem("user_phone");
          localStorage.removeItem("user_role");
          window.location.href = "/login?redirect=/user";
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.ok && data.user) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            created_at: data.user.createdAt || new Date().toISOString()
          });
          // Update localStorage with verified data
          localStorage.setItem("user_id", data.user.id.toString());
          localStorage.setItem("user_name", data.user.name);
          if (data.user.email) localStorage.setItem("user_email", data.user.email);
          if (data.user.phone) localStorage.setItem("user_phone", data.user.phone);
          if (data.user.role) localStorage.setItem("user_role", data.user.role);
          
          // Fetch additional data
          if (data.user.email) {
            fetchAccountData(data.user.email);
          } else {
            setLoading(false);
          }
        } else if (data && !data.ok) {
          // Authentication failed - redirect to login
          localStorage.removeItem("user_token");
          window.location.href = "/login?redirect=/user";
          return;
        }
        if (!data || !data.ok || !data.user?.email) {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setLoading(false);
        // On error, redirect to login
        localStorage.removeItem("user_token");
        window.location.href = "/login?redirect=/user";
      });
  }, []);

  const fetchAccountData = async (email: string) => {
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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="opacity-70">טוען...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-charcoal text-white">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                <User className="size-8 text-zinc-300" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white mb-1">{user?.name}</h1>
                <p className="text-zinc-400">לוח בקרה אישי</p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition">
              <Settings className="size-4" />
              הגדרות
            </button>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex gap-2 mb-8 border-b border-zinc-800 overflow-x-auto">
            {[
              { id: "overview" as const, label: "סקירה", icon: User },
              { id: "profile" as const, label: "פרופיל", icon: User },
              { id: "loyalty" as const, label: "נאמנות", icon: Star },
              { id: "orders" as const, label: "הזמנות", icon: Package },
              { id: "support" as const, label: "תמיכה", icon: MessageSquare },
              { id: "reports" as const, label: "דוחות", icon: FileText },
              { id: "api-keys" as const, label: "Secret Keys", icon: Key }
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
        </ScrollReveal>

        {/* Tab Content */}
        <ScrollReveal delay={0.2}>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {loyaltyData && (
                <div className={`rounded-2xl border p-6 backdrop-blur-sm ${getTierColor(loyaltyData.tier)}`}>
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
                      <p className="text-sm opacity-80">סה&quot;כ נצבר</p>
                      <p className="text-lg font-semibold">{loyaltyData.total_earned}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">סה&quot;כ הוצא</p>
                      <p className="text-lg font-semibold">{loyaltyData.total_spent}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("loyalty")}
                  className="bg-black/30 rounded-2xl border border-zinc-800 p-6 backdrop-blur-sm hover:border-gold transition-colors text-right"
                >
                  <Gift className="text-gold mb-3" size={32} />
                  <h3 className="font-semibold text-white mb-1">קופונים</h3>
                  <p className="text-zinc-400 text-sm">{coupons.filter(c => c.status === "active").length} פעילים</p>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className="bg-black/30 rounded-2xl border border-zinc-800 p-6 backdrop-blur-sm hover:border-gold transition-colors text-right"
                >
                  <ShoppingCart className="text-gold mb-3" size={32} />
                  <h3 className="font-semibold text-white mb-1">הזמנות</h3>
                  <p className="text-zinc-400 text-sm">{orders.length} הזמנות</p>
                </button>

                <button
                  onClick={() => setActiveTab("support")}
                  className="bg-black/30 rounded-2xl border border-zinc-800 p-6 backdrop-blur-sm hover:border-gold transition-colors text-right"
                >
                  <Ticket className="text-gold mb-3" size={32} />
                  <h3 className="font-semibold text-white mb-1">כרטיסי תמיכה</h3>
                  <p className="text-zinc-400 text-sm">{tickets.filter(t => t.status !== "closed").length} פתוחים</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === "profile" && user && (
            <ProfileEditor user={user} onUpdate={setUser} />
          )}

          {activeTab === "loyalty" && (
            <div className="space-y-6">
              {user?.email && (
                <>
                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                    <LoyaltyPoints userEmail={user.email} />
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4">קופונים אישיים</h3>
                    <LoyaltyCoupons userEmail={user.email} />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">הזמנות שלי</h2>
                <button className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition text-sm">
                  הזמנה חדשה
                </button>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="size-12 mx-auto mb-4 text-zinc-400" />
                  <p className="text-zinc-400 mb-4">אין הזמנות עדיין</p>
                  <a
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition"
                  >
                    הזמינו ייעוץ חינם
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-zinc-800 bg-black/30 p-6 hover:border-zinc-600 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{order.product_sku}</div>
                          <div className="text-sm text-zinc-400 mb-2">
                            {new Date(order.created_at).toLocaleDateString("he-IL", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <a
                              href={`/order/${order.id}`}
                              className="text-sm text-gold hover:text-gold/80 transition"
                            >
                              צפה בפרטים
                            </a>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="font-bold text-gold mb-1 text-xl">{order.total} ₪</div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "completed" ? "bg-green-500/20 text-green-400" :
                            order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            order.status === "processing" ? "bg-blue-500/20 text-blue-400" :
                            "bg-zinc-800 text-zinc-400"
                          }`}>
                            {order.status === "completed" ? "הושלם" :
                             order.status === "pending" ? "ממתין" :
                             order.status === "processing" ? "בטיפול" : "בטיפול"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "support" && (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">תמיכה טכנית</h2>
              <div className="space-y-6">
                <div className="rounded-xl border border-zinc-800 bg-black/30 p-6">
                  <h3 className="font-semibold text-white mb-4">פתח קריאת שירות</h3>
                  <TicketForm
                    onSuccess={() => {
                      if (user?.email) {
                        fetchAccountData(user.email);
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">קריאות קודמות</h3>
                  <div className="space-y-3">
                    {tickets.length > 0 ? (
                      tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="bg-black/30 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 transition"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white">#{ticket.ticket_number}</p>
                              <p className="text-sm text-zinc-400">{ticket.subject}</p>
                              <p className="text-xs text-zinc-500 mt-1">
                                {new Date(ticket.created_at).toLocaleDateString("he-IL")}
                              </p>
                            </div>
                            <div className="text-left">
                              <span
                                className={`px-3 py-1 rounded text-sm ${
                                  ticket.status === "open"
                                    ? "bg-green-900/30 text-green-400"
                                    : ticket.status === "resolved"
                                    ? "bg-blue-900/30 text-blue-400"
                                    : "bg-gray-700 text-gray-400"
                                }`}
                              >
                                {ticket.status === "open" ? "פתוח" :
                                 ticket.status === "resolved" ? "נפתר" :
                                 ticket.status === "closed" ? "סגור" : ticket.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-zinc-400 rounded-xl border border-zinc-800 bg-black/30">
                        אין קריאות פתוחות
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-black/30 p-6">
                  <h3 className="font-semibold text-white mb-4">דרכי יצירת קשר</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Phone className="size-4 text-zinc-400" />
                      <a href="tel:+972559737025" className="text-zinc-300 hover:text-gold transition">
                        +972-55-973-7025
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="size-4 text-zinc-400" />
                      <a href="https://wa.me/972559737025" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-gold transition">
                        WhatsApp
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="size-4 text-zinc-400" />
                      <a href="mailto:aegisspectra@gmail.com" className="text-zinc-300 hover:text-gold transition">
                        aegisspectra@gmail.com
                      </a>
                    </div>
                    <div className="text-zinc-400 text-xs mt-4">
                      שעות פעילות: א׳-ה׳ 09:00-18:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">דוחות וסטטיסטיקות</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {orders.length}
                    </div>
                    <div className="text-sm text-zinc-400">הזמנות</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {orders.filter(o => o.status === 'completed').length}
                    </div>
                    <div className="text-sm text-zinc-400">הושלמו</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-center">
                    <div className="text-3xl font-bold text-gold mb-2">
                      {orders.reduce((sum, o) => sum + o.total, 0)} ₪
                    </div>
                    <div className="text-sm text-zinc-400">סה״כ הוצאות</div>
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-black/30 p-6">
                  <h3 className="font-semibold text-white mb-4">דוחות זמינים</h3>
                  <div className="space-y-3">
                    <button className="w-full text-right p-4 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition">
                      <div className="font-semibold text-white">דוח הזמנות</div>
                      <div className="text-sm text-zinc-400">צפייה והורדה של כל ההזמנות</div>
                    </button>
                    <button className="w-full text-right p-4 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition">
                      <div className="font-semibold text-white">דוח תחזוקה</div>
                      <div className="text-sm text-zinc-400">היסטוריית תחזוקה ותיקונים</div>
                    </button>
                    <button className="w-full text-right p-4 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition">
                      <div className="font-semibold text-white">דוח ביצועים</div>
                      <div className="text-sm text-zinc-400">סטטיסטיקות ביצועי מערכת</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api-keys" && (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Key className="size-6 text-gold" />
                  Secret Keys שלי
                </h2>
                <Link
                  href="/user/api-keys"
                  className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition text-sm"
                >
                  ניהול מלא
                </Link>
              </div>
              <div className="text-center py-12">
                <Key className="size-16 mx-auto mb-6 text-zinc-600" />
                <p className="text-zinc-400 mb-4">ניהול Secret Keys מלא</p>
                <Link
                  href="/user/api-keys"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition"
                >
                  <Key className="size-5" />
                  עבור לניהול Secret Keys
                </Link>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
      <Footer />
    </main>
  );
}

