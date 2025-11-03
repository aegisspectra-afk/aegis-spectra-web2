"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Phone, MapPin, Package, MessageSquare, Calendar, 
  CheckCircle, XCircle, Lock, Search, Filter, RefreshCw, 
  TrendingUp, Users, Clock, Edit2, Save, X, Download,
  ChevronDown, ChevronUp, CheckSquare, Square, BarChart3, FileText, Bell
} from "lucide-react";
import { ToastContainer, useToast, ToastType } from "@/components/Toast";
import { BarChart, PieChart } from "@/components/Chart";

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

type StatusCounts = {
  new: number;
  contacted: number;
  closed: number;
  total: number;
};

const fmt = (n: number) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(n);

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  
  // חיפוש וסינון
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // עריכה
  const [editingLead, setEditingLead] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  
  // Toast notifications
  const { toasts, showToast, closeToast } = useToast();
  
  // Bulk actions
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const [bulkNotes, setBulkNotes] = useState<string>("");
  
  // Charts & views
  const [showCharts, setShowCharts] = useState(false);
  
  // New leads tracking
  const lastLeadCountRef = useRef<number>(0);
  const lastFetchTimeRef = useRef<number>(Date.now());

  // בדיקה אם כבר מאומת
  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");
    const savedPassword = localStorage.getItem("admin_password");
    if (savedAuth === "true" && savedPassword) {
      setIsAuthenticated(true);
      setPassword(savedPassword);
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
        localStorage.setItem("admin_password", password);
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

  async function fetchLeads(showNotification = false) {
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

      const res = await fetch("/api/leads", {
        headers: {
          "Authorization": `Bearer ${savedPassword}`
        }
      });
      
      const data = await res.json();
      
      if (data.ok && data.leads) {
        const newLeads = data.leads;
        const currentCount = newLeads.length;
        
        // בדיקת לידים חדשים
        if (showNotification && lastLeadCountRef.current > 0 && currentCount > lastLeadCountRef.current) {
          const newCount = currentCount - lastLeadCountRef.current;
          showToast(`לידים חדשים: ${newCount}`, "info");
        }
        
        setLeads(newLeads);
        lastLeadCountRef.current = currentCount;
        lastFetchTimeRef.current = Date.now();
      } else if (data.requiresAuth) {
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
      showToast("שגיאה בטעינת הלידים", "error");
    } finally {
      setLoading(false);
    }
  }
  
  // Auto-refresh כל 30 שניות
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchLeads(true);
    }, 30000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function updateLead(id: number, status: string, notes: string) {
    try {
      const savedPassword = localStorage.getItem("admin_password");
      if (!savedPassword) return;

      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${savedPassword}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status, notes })
      });

      const data = await res.json();

      if (data.ok && data.lead) {
        setLeads(leads.map(l => l.id === id ? data.lead : l));
        setEditingLead(null);
        showToast("ליד עודכן בהצלחה", "success");
      } else {
        showToast("שגיאה בעדכון הליד", "error");
      }
    } catch (err) {
      console.error("Error updating lead:", err);
      showToast("שגיאה בעדכון הליד", "error");
    }
  }
  
  // CSV Export
  function exportToCSV() {
    const headers = ["ID", "שם", "טלפון", "עיר", "מוצר", "סטטוס", "הערות לקוח", "הערות מנהל", "תאריך יצירה"];
    const rows = filteredLeads.map(lead => [
      lead.id,
      lead.name,
      lead.phone,
      lead.city || "",
      lead.product_sku || "",
      lead.status || "new",
      lead.message || "",
      lead.notes || "",
      new Date(lead.created_at).toLocaleString("he-IL")
    ]);
    
    const csv = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV יוצא בהצלחה", "success");
  }
  
  // Bulk actions
  function toggleSelectLead(id: number) {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  }
  
  function selectAll() {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  }
  
  async function bulkUpdate() {
    if (selectedLeads.length === 0) {
      showToast("אנא בחר לידים לעדכון", "warning");
      return;
    }
    
    try {
      const savedPassword = localStorage.getItem("admin_password");
      if (!savedPassword) return;
      
      const res = await fetch("/api/leads/bulk", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${savedPassword}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ids: selectedLeads,
          status: bulkStatus || undefined,
          notes: bulkNotes || undefined
        })
      });
      
      const data = await res.json();
      
      if (data.ok && data.leads) {
        setLeads(leads.map(l => {
          const updated = data.leads.find((ul: Lead) => ul.id === l.id);
          return updated || l;
        }));
        setSelectedLeads([]);
        setShowBulkActions(false);
        setBulkStatus("");
        setBulkNotes("");
        showToast(`${data.count} לידים עודכנו בהצלחה`, "success");
      } else {
        showToast("שגיאה בעדכון הלידים", "error");
      }
    } catch (err) {
      console.error("Error bulk updating:", err);
      showToast("שגיאה בעדכון הלידים", "error");
    }
  }

  function startEdit(lead: Lead) {
    setEditingLead(lead.id);
    setEditStatus(lead.status || "new");
    setEditNotes(lead.notes || "");
  }

  function cancelEdit() {
    setEditingLead(null);
    setEditStatus("");
    setEditNotes("");
  }

  // סטטיסטיקות
  const stats: StatusCounts = useMemo(() => {
    return leads.reduce((acc, lead) => {
      acc.total++;
      const status = lead.status || "new";
      if (status === "new") acc.new++;
      else if (status === "contacted") acc.contacted++;
      else if (status === "closed") acc.closed++;
      return acc;
    }, { new: 0, contacted: 0, closed: 0, total: 0 } as StatusCounts);
  }, [leads]);

  // לידים מסוננים וממוינים
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // חיפוש
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        (lead.city && lead.city.toLowerCase().includes(query)) ||
        (lead.product_sku && lead.product_sku.toLowerCase().includes(query))
      );
    }

    // סינון לפי סטטוס
    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => (lead.status || "new") === statusFilter);
    }

    // מיון
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === "asc" 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [leads, searchQuery, statusFilter, sortBy, sortOrder]);

  // Charts data
  const chartData = useMemo(() => {
    return [
      { label: "חדש", value: stats.new, color: "#D4AF37" },
      { label: "נוצר קשר", value: stats.contacted, color: "#10B981" },
      { label: "סגור", value: stats.closed, color: "#3B82F6" },
    ];
  }, [stats]);

  // מסך התחברות
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full px-4"
        >
          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400"
                >
                  {authError}
                </motion.div>
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
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="text-gold size-8" />
            <div>
              <h1 className="text-3xl font-extrabold">ניהול לידים</h1>
              <p className="text-zinc-400 text-sm mt-1">Aegis Spectra - Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition text-sm"
            >
              <BarChart3 className="size-4" />
              {showCharts ? "הסתר גרפים" : "הצג גרפים"}
            </button>
            <button
              onClick={exportToCSV}
              disabled={filteredLeads.length === 0}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition text-sm disabled:opacity-50"
            >
              <Download className="size-4" />
              ייצוא CSV
            </button>
            <button
              onClick={() => fetchLeads(false)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition text-sm disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
              רענון
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition text-sm"
            >
              <Lock className="size-4" />
              התנתק
            </button>
          </div>
        </div>

        {/* סטטיסטיקות */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">סה&ldquo;כ לידים</span>
              <Users className="size-5 text-gold" />
            </div>
            <div className="text-3xl font-extrabold text-gold">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gold/30 bg-gold/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">חדשים</span>
              <Clock className="size-5 text-gold" />
            </div>
            <div className="text-3xl font-extrabold text-gold">{stats.new}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">נוצר קשר</span>
              <CheckCircle className="size-5 text-green-400" />
            </div>
            <div className="text-3xl font-extrabold text-green-400">{stats.contacted}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">סגורים</span>
              <TrendingUp className="size-5 text-zinc-400" />
            </div>
            <div className="text-3xl font-extrabold text-zinc-400">{stats.closed}</div>
          </motion.div>
        </div>

        {/* Charts */}
        {showCharts && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <BarChart data={chartData} title="לידים לפי סטטוס" />
            <PieChart data={chartData} title="התפלגות לידים" />
          </motion.div>
        )}

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gold/50 bg-gold/10 p-6 mb-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckSquare className="text-gold size-5" />
                <span className="font-semibold">נבחרו {selectedLeads.length} לידים</span>
              </div>
              <button
                onClick={() => {
                  setSelectedLeads([]);
                  setShowBulkActions(false);
                }}
                className="text-sm opacity-70 hover:opacity-100 transition"
              >
                ביטול
              </button>
            </div>
            {showBulkActions ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm opacity-70 mb-2">סטטוס</label>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70"
                  >
                    <option value="">לא לשנות</option>
                    <option value="new">חדש</option>
                    <option value="contacted">נוצר קשר</option>
                    <option value="closed">סגור</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-2">הערות</label>
                  <input
                    type="text"
                    value={bulkNotes}
                    onChange={(e) => setBulkNotes(e.target.value)}
                    placeholder="הערות מנהל..."
                    className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={bulkUpdate}
                    className="flex-1 rounded-lg bg-gold text-black font-semibold py-2 hover:bg-gold/90 transition"
                  >
                    עדכן
                  </button>
                  <button
                    onClick={() => setShowBulkActions(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowBulkActions(true)}
                className="rounded-lg border border-gold px-4 py-2 hover:bg-gold/20 transition"
              >
                עדכן לידים נבחרים
              </button>
            )}
          </motion.div>
        )}

        {/* חיפוש וסינון */}
        <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 mb-6 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-4">
            {/* חיפוש */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש לפי שם, טלפון, עיר..."
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-gold/70 transition"
              />
            </div>

            {/* סינון לפי סטטוס */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-gold/70 transition"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="new">חדש</option>
                <option value="contacted">נוצר קשר</option>
                <option value="closed">סגור</option>
              </select>
            </div>

            {/* מיון */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                className="flex-1 bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition"
              >
                <option value="date">מיון לפי תאריך</option>
                <option value="name">מיון לפי שם</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
              >
                {sortOrder === "asc" ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-gold" />
            <p className="opacity-70">טוען לידים...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-500/50 bg-red-500/10 p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-red-400" />
              <h3 className="text-red-400 font-semibold">שגיאה</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">{error}</p>
            <button 
              onClick={() => fetchLeads(false)}
              className="mt-4 rounded-lg border border-red-500 px-4 py-2 hover:bg-red-500/20 transition"
            >
              נסה שוב
            </button>
          </motion.div>
        )}

        {/* רשימת לידים */}
        {!loading && !error && filteredLeads.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-zinc-800 bg-black/30">
            <p className="opacity-70 mb-2">אין לידים התואמים לחיפוש</p>
            <p className="text-sm opacity-60">נסה לשנות את החיפוש או הסינון</p>
          </div>
        )}

        {!loading && !error && filteredLeads.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm opacity-70">
                מציג {filteredLeads.length} מתוך {leads.length} לידים
              </div>
              <button
                onClick={selectAll}
                className="flex items-center gap-2 text-sm rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition"
              >
                {selectedLeads.length === filteredLeads.length ? (
                  <>
                    <CheckSquare className="size-4" />
                    בטל בחירה
                  </>
                ) : (
                  <>
                    <Square className="size-4" />
                    בחר הכל
                  </>
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {filteredLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl border p-6 hover:border-zinc-700 transition backdrop-blur-sm ${
                    selectedLeads.includes(lead.id) 
                      ? "border-gold bg-gold/10" 
                      : "border-zinc-800 bg-black/30"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <button
                      onClick={() => toggleSelectLead(lead.id)}
                      className="mt-1"
                    >
                      {selectedLeads.includes(lead.id) ? (
                        <CheckSquare className="size-5 text-gold" />
                      ) : (
                        <Square className="size-5 text-zinc-600" />
                      )}
                    </button>
                    <div className="flex-1">
                  {editingLead === lead.id ? (
                    // מצב עריכה
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gold">{lead.name}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateLead(lead.id, editStatus, editNotes)}
                            className="p-2 rounded-lg bg-gold text-black hover:bg-gold/90 transition"
                          >
                            <Save className="size-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm opacity-70 mb-2">סטטוס</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70"
                          >
                            <option value="new">חדש</option>
                            <option value="contacted">נוצר קשר</option>
                            <option value="closed">סגור</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm opacity-70 mb-2">הערות</label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70"
                            rows={3}
                            placeholder="הערות מנהל..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // מצב תצוגה
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gold mb-2">{lead.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
                            <div className="flex items-center gap-2">
                              <Phone className="size-4" />
                              <a href={`tel:${lead.phone}`} className="hover:text-gold transition">
                                {lead.phone}
                              </a>
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(lead)}
                            className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                            title="עריכה"
                          >
                            <Edit2 className="size-4" />
                          </button>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            lead.status === 'new' ? 'bg-gold/20 text-gold' :
                            lead.status === 'contacted' ? 'bg-green-500/20 text-green-400' :
                            'bg-zinc-700/50 text-zinc-300'
                          }`}>
                            {lead.status === 'new' ? 'חדש' :
                             lead.status === 'contacted' ? 'נוצר קשר' :
                             lead.status === 'closed' ? 'סגור' : 'חדש'}
                          </div>
                        </div>
                      </div>

                      {lead.product_sku && (
                        <div className="mb-3 flex items-center gap-2 text-sm bg-black/30 p-3 rounded-lg">
                          <Package className="size-4 text-gold" />
                          <span className="opacity-80">מוצר:</span>
                          <span className="font-semibold">{lead.product_sku}</span>
                        </div>
                      )}

                      {lead.message && (
                        <div className="mb-3 p-3 bg-black/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1 text-sm opacity-70">
                            <MessageSquare className="size-4" />
                            הערות לקוח:
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
                    </>
                  )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
