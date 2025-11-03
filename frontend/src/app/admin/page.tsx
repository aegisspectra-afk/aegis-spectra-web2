"use client";

import { useEffect, useState } from "react";
import { Shield, Phone, MapPin, Package, MessageSquare, Calendar, CheckCircle, XCircle, Lock } from "lucide-react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  city: string | null;
  message: string | null;
  product_sku: string | null;
  created_at: string;
  status: string | null;
  notes: string | null;
};

const fmt = (n: number) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(n);

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // בדיקה אם כבר מאומת
  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");
    const savedPassword = localStorage.getItem("admin_password");
    if (savedAuth === "true" && savedPassword) {
      setIsAuthenticated(true);
      setPassword(savedPassword);
      // נטען את הלידים אחרי שהקומפוננטה מוכנה
      setTimeout(() => {
        fetchLeads();
      }, 100);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    
    try {
      const res = await fetch("/api/leads", {
        headers: {
          "Authorization": `Bearer ${password}`
        }
      });
      
      const data = await res.json();
      
      if (data.ok && data.leads) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_password", password); // שמירת הסיסמה
        setLeads(data.leads);
        setLoading(false);
      } else if (data.requiresAuth) {
        setAuthError("סיסמה שגויה");
      } else {
        setAuthError(data.error || "שגיאה בהתחברות");
      }
    } catch (err) {
      console.error("Error:", err);
      setAuthError("שגיאה בהתחברות");
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_password");
    setIsAuthenticated(false);
    setLeads([]);
    setPassword("");
  }

  async function fetchLeads() {
    setLoading(true);
    setError(null);
    try {
      const savedAuth = localStorage.getItem("admin_auth");
      const savedPassword = localStorage.getItem("admin_password") || password;
      
      if (savedAuth !== "true" || !savedPassword) {
        setError("נדרשת התחברות");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // נשלח את הסיסמה מהזיכרון
      const res = await fetch("/api/leads", {
        headers: {
          "Authorization": `Bearer ${savedPassword}`
        }
      });
      
      const data = await res.json();
      
      if (data.ok && data.leads) {
        setLeads(data.leads);
      } else if (data.requiresAuth) {
        // אם הסיסמה לא תקינה, נבקש התחברות מחדש
        setIsAuthenticated(false);
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_password");
        setError("נדרשת התחברות מחדש");
      } else {
        setError(data.error || "שגיאה בטעינת הלידים");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("שגיאה בטעינת הלידים");
    } finally {
      setLoading(false);
    }
  }

  // מסך התחברות
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
        
        <div className="max-w-md w-full px-4">
          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Shield className="text-gold size-8" />
              <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm opacity-70 mb-2">סיסמה</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition"
                  placeholder="הזן סיסמה"
                  required
                  autoFocus
                />
              </div>
              
              {authError && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full rounded-xl bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition"
              >
                התחברות
              </button>
            </form>
            
            <p className="mt-6 text-xs opacity-60 text-center">
              ברירת מחדל: <code className="bg-black/50 px-2 py-1 rounded">aegis2024</code>
              <br />
              ניתן לשנות ב-Netlify Environment Variables
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="text-gold size-8" />
            <div>
              <h1 className="text-3xl font-extrabold">ניהול לידים</h1>
              <p className="text-zinc-400 text-sm mt-1">Aegis Spectra - Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition text-sm"
          >
            <Lock className="size-4" />
            התנתק
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="opacity-70">טוען לידים...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-red-400" />
              <h3 className="text-red-400 font-semibold">שגיאה</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">{error}</p>
            {error.includes("table not found") && (
              <div className="bg-black/30 p-4 rounded-lg text-sm">
                <p className="mb-2 font-semibold">פתרון:</p>
                <p className="opacity-80">
                  1. לך ל-Netlify Dashboard → Database → SQL Editor<br />
                  2. הרץ את הקוד מ-<code className="bg-black/50 px-2 py-1 rounded">schema.sql</code>
                </p>
              </div>
            )}
            <button 
              onClick={fetchLeads}
              className="mt-4 rounded-lg border border-red-500 px-4 py-2 hover:bg-red-500/20 transition"
            >
              נסה שוב
            </button>
          </div>
        )}

        {!loading && !error && leads.length === 0 && (
          <div className="text-center py-12">
            <p className="opacity-70 mb-4">אין לידים עדיין</p>
            <p className="text-sm opacity-60">כל ליד שיישלח דרך הטופס יופיע כאן</p>
          </div>
        )}

        {!loading && !error && leads.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm opacity-70">
                סה&ldquo;כ {leads.length} לידים
              </div>
              <button 
                onClick={fetchLeads}
                className="text-sm rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition"
              >
                רענון
              </button>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => (
                <div 
                  key={lead.id} 
                  className="rounded-2xl border border-zinc-800 bg-black/30 p-6 hover:border-zinc-700 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gold mb-1">{lead.name}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-80">
                        <div className="flex items-center gap-2">
                          <Phone className="size-4" />
                          {lead.phone}
                        </div>
                        {lead.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            {lead.city}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4" />
                          {new Date(lead.created_at).toLocaleDateString("he-IL", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lead.status === 'new' ? 'bg-gold/20 text-gold' :
                      lead.status === 'contacted' ? 'bg-green-500/20 text-green-400' :
                      'bg-zinc-700/50 text-zinc-300'
                    }`}>
                      {lead.status || 'new'}
                    </div>
                  </div>

                  {lead.product_sku && (
                    <div className="mb-3 flex items-center gap-2 text-sm">
                      <Package className="size-4 text-gold" />
                      <span className="opacity-80">מוצר:</span>
                      <span className="font-semibold">{lead.product_sku}</span>
                    </div>
                  )}

                  {lead.message && (
                    <div className="mb-3 p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1 text-sm opacity-70">
                        <MessageSquare className="size-4" />
                        הערות:
                      </div>
                      <p className="text-sm">{lead.message}</p>
                    </div>
                  )}

                  {lead.notes && (
                    <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
                      <div className="text-xs opacity-70 mb-1">הערות מנהל:</div>
                      <p className="text-sm">{lead.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

