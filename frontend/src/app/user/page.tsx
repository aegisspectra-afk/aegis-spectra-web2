"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, User, Phone, Mail, Calendar, Package, 
  MessageSquare, FileText, Settings, LogOut, Clock, CheckCircle, Download
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

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

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "support" | "reports">("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // בדיקה אם יש משתמש מחובר (בעתיד - authentication)
    const savedUser = localStorage.getItem("user_profile");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // כאן אפשר לטעון הזמנות ותמיכה מה-API
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
      // Demo user for now
      setUser({
        id: 1,
        name: "דני כהן",
        email: "danny@example.com",
        phone: "0501234567",
        created_at: new Date().toISOString()
      });
    }
    setLoading(false);
  }, []);

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
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-20">
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
          <div className="flex gap-2 mb-8 border-b border-zinc-800">
            {[
              { id: "profile" as const, label: "פרופיל", icon: User },
              { id: "orders" as const, label: "הזמנות", icon: Package },
              { id: "support" as const, label: "תמיכה", icon: MessageSquare },
              { id: "reports" as const, label: "דוחות", icon: FileText }
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
          {activeTab === "profile" && user && (
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">פרטים אישיים</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <User className="size-5 text-zinc-400" />
                  <div>
                    <div className="text-sm text-zinc-400">שם מלא</div>
                    <div className="text-white font-semibold">{user.name}</div>
                  </div>
                </div>
                {user.email && (
                  <div className="flex items-center gap-4">
                    <Mail className="size-5 text-zinc-400" />
                    <div>
                      <div className="text-sm text-zinc-400">אימייל</div>
                      <div className="text-white font-semibold">{user.email}</div>
                    </div>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-4">
                    <Phone className="size-5 text-zinc-400" />
                    <div>
                      <div className="text-sm text-zinc-400">טלפון</div>
                      <div className="text-white font-semibold">{user.phone}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Calendar className="size-5 text-zinc-400" />
                  <div>
                    <div className="text-sm text-zinc-400">תאריך הצטרפות</div>
                    <div className="text-white font-semibold">
                      {new Date(user.created_at).toLocaleDateString("he-IL")}
                    </div>
                  </div>
                </div>
              </div>
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
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    // Handle form submission
                    alert('קריאת שירות נשלחה! נחזור אליך בהקדם.');
                  }}>
                    <div>
                      <label className="block text-sm mb-2 text-zinc-300">נושא</label>
                      <input
                        type="text"
                        required
                        placeholder="לדוגמה: בעיה במצלמה, תיקון נדרש..."
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-zinc-300">תיאור הבעיה</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="תאר את הבעיה בפירוט..."
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition"
                      >
                        שלח קריאה
                      </button>
                      <a
                        href="https://wa.me/972559737025"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition inline-flex items-center gap-2"
                      >
                        <Phone className="size-4" />
                        WhatsApp
                      </a>
                    </div>
                  </form>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">קריאות קודמות</h3>
                  <div className="space-y-3">
                    <div className="text-center py-8 text-zinc-400 rounded-xl border border-zinc-800 bg-black/30">
                      אין קריאות פתוחות
                    </div>
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
        </ScrollReveal>
      </div>
    </main>
  );
}

