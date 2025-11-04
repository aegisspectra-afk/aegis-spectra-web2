"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Key, Plus, Trash2, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

type ApiKey = {
  id: number;
  name: string;
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  displayKey: string;
};

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/auth/api-key", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.ok && data.apiKeys) {
        setApiKeys(data.apiKeys);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createApiKey() {
    if (!newKeyName.trim()) {
      alert("אנא הזן שם ל-Secret Key");
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/auth/api-key", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newKeyName })
      });

      const data = await response.json();
      if (data.ok && data.apiKey) {
        setNewApiKey(data.apiKey);
        setShowCreateForm(false);
        setNewKeyName("");
        fetchApiKeys(); // Refresh list
      } else {
        alert(data.error || "שגיאה ביצירת Secret Key");
      }
    } catch (error) {
      console.error("Error creating Secret key:", error);
      alert("שגיאה ביצירת Secret Key");
    } finally {
      setCreating(false);
    }
  }

  async function deleteApiKey(keyId: number) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את ה-Secret Key הזה?")) {
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`/api/auth/api-key?id=${keyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.ok) {
        fetchApiKeys(); // Refresh list
      } else {
        alert(data.error || "שגיאה במחיקת Secret Key");
      }
    } catch (error) {
      console.error("Error deleting Secret key:", error);
      alert("שגיאה במחיקת Secret Key");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <Key className="size-8 text-gold" />
                Secret Keys שלי
              </h1>
              <p className="text-zinc-400">
                נהל את ה-Secret Keys שלך. כל Secret Key מאפשר גישה לחשבון שלך.
              </p>
            </div>
          </ScrollReveal>

          {/* New API Key Display (shown only once) */}
          {newApiKey && (
            <ScrollReveal delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/10 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <AlertCircle className="size-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-yellow-400">⚠️ שמור את ה-Secret Key החדש!</h3>
                    <p className="text-sm text-zinc-300 mb-4">
                      ה-Secret Key הזה יוצג רק פעם אחת. אנא שמור אותו במקום בטוח!
                    </p>
                  </div>
                </div>
                <div className="bg-black/50 rounded-lg p-4 mb-4">
                  <code className="text-gold font-mono text-sm break-all">{newApiKey}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(newApiKey)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="size-5" />
                      הועתק!
                    </>
                  ) : (
                    <>
                      <Copy className="size-5" />
                      העתק Secret Key
                    </>
                  )}
                </button>
                <button
                  onClick={() => setNewApiKey(null)}
                  className="ml-4 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 font-semibold hover:bg-zinc-800 transition"
                >
                  סגור
                </button>
              </motion.div>
            </ScrollReveal>
          )}

          {/* Create New API Key */}
          <ScrollReveal delay={0.2}>
            <div className="mb-8">
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-4 font-semibold hover:bg-gold/90 transition"
                >
                  <Plus className="size-5" />
                  צור Secret Key חדש
                </button>
              ) : (
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold mb-4">צור Secret Key חדש</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">שם (אופציונלי)</label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="לדוגמה: Production API, Development API"
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={createApiKey}
                        disabled={creating}
                        className="flex-1 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {creating ? (
                          <>
                            <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            יוצר...
                          </>
                        ) : (
                          <>
                            <Key className="size-5" />
                            צור Secret Key
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewKeyName("");
                        }}
                        className="px-6 py-3 rounded-xl border border-zinc-700 bg-black/30 hover:bg-zinc-800 transition"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* API Keys List */}
          <ScrollReveal delay={0.3}>
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6">Secret Keys שלי</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="size-12 border-2 border-zinc-700 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-zinc-400">טוען Secret Keys...</p>
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="size-16 mx-auto mb-6 text-zinc-600" />
                  <h3 className="text-xl font-bold mb-2">אין Secret Keys</h3>
                  <p className="text-zinc-400 mb-6">צור Secret Key חדש כדי להתחיל</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="rounded-xl border border-zinc-800 bg-black/30 p-6 hover:border-zinc-600 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Key className="size-5 text-gold" />
                            <h3 className="font-semibold text-lg">{key.name}</h3>
                            {key.isActive ? (
                              <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                                פעיל
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                                לא פעיל
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-zinc-400">
                            <p>Secret Key: <code className="text-zinc-300">{key.displayKey}</code></p>
                            {key.lastUsed && (
                              <p>שימוש אחרון: {new Date(key.lastUsed).toLocaleDateString("he-IL")}</p>
                            )}
                            <p>נוצר: {new Date(key.createdAt).toLocaleDateString("he-IL")}</p>
                            {key.expiresAt && (
                              <p>פג תוקף: {new Date(key.expiresAt).toLocaleDateString("he-IL")}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteApiKey(key.id)}
                          className="p-3 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                          title="מחק Secret Key"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Security Info */}
          <ScrollReveal delay={0.4}>
            <div className="mt-8 p-6 rounded-xl bg-zinc-800/30 border border-zinc-700">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="size-5 text-yellow-400" />
                אבטחה
              </h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• שמור את ה-Secret Keys שלך בסוד - אל תשתף אותם עם אחרים</li>
                <li>• אם Secret Key נחשף, מחק אותו מיד וצור חדש</li>
                <li>• כל Secret Key מאפשר גישה מלאה לחשבון שלך</li>
                <li>• מומלץ ליצור Secret Key נפרד לכל אפליקציה או שירות</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}

