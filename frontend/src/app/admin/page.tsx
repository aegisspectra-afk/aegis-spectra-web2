"use client";

import { useEffect, useState } from "react";
import { Shield, Phone, MapPin, Package, MessageSquare, Calendar, CheckCircle, XCircle } from "lucide-react";

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

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      
      if (data.ok && data.leads) {
        setLeads(data.leads);
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

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-gold size-8" />
          <div>
            <h1 className="text-3xl font-extrabold">ניהול לידים</h1>
            <p className="text-zinc-400 text-sm mt-1">Aegis Spectra - Admin Dashboard</p>
          </div>
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
                סה"כ {leads.length} לידים
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

