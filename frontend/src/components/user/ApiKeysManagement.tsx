"use client";

import { useState, useEffect } from "react";
import { Key, Plus, Trash2, Copy, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used?: string;
  usage_count: number;
  status: "active" | "revoked";
}

interface ApiKeysManagementProps {
  userEmail?: string;
}

export function ApiKeysManagement({ userEmail }: ApiKeysManagementProps) {
  const { showToast } = useToastContext();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userEmail) {
      fetchKeys();
    }
  }, [userEmail]);

  const fetchKeys = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user/api-keys", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (data.ok && data.keys) {
        setKeys(data.keys);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      showToast("יש להזין שם למפתח", "error");
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newKeyName })
      });

      const data = await response.json();
      if (data.ok && data.key) {
        showToast("מפתח API נוצר בהצלחה", "success");
        setShowCreateModal(false);
        setNewKeyName("");
        fetchKeys();
        // Reveal the new key
        if (data.key.full_key) {
          const newRevealedKeys = new Set(revealedKeys);
          newRevealedKeys.add(data.key.id);
          setRevealedKeys(newRevealedKeys);
        }
      } else {
        showToast(data.error || "שגיאה ביצירת מפתח", "error");
      }
    } catch (error) {
      showToast("שגיאה ביצירת מפתח", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId: string) => {
    if (!confirm("האם אתה בטוח שברצונך לבטל את המפתח? פעולה זו אינה בלתי הפיכה.")) {
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/api-keys/${keyId}/revoke`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (data.ok) {
        showToast("מפתח בוטל בהצלחה", "success");
        fetchKeys();
      } else {
        showToast(data.error || "שגיאה בביטול מפתח", "error");
      }
    } catch (error) {
      showToast("שגיאה בביטול מפתח", "error");
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast("מפתח הועתק!", "success");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען מפתחות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Key className="size-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">ניהול API Keys</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold/90 transition"
        >
          <Plus className="size-4" />
          מפתח חדש
        </button>
      </div>

      {keys.length === 0 ? (
        <div className="text-center py-12">
          <Key className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין מפתחות API</p>
          <p className="text-sm text-zinc-500">צור מפתח חדש כדי להתחיל להשתמש ב-API</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <div
              key={key.id}
              className={`rounded-xl border p-4 ${
                key.status === "active"
                  ? "border-zinc-800 bg-black/20"
                  : "border-red-500/30 bg-red-500/10 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">{key.name}</h3>
                    {key.status === "active" ? (
                      <CheckCircle className="size-4 text-green-400" />
                    ) : (
                      <AlertCircle className="size-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="px-3 py-1.5 rounded bg-black/50 border border-zinc-700 text-sm text-zinc-300 font-mono">
                      {revealedKeys.has(key.id) ? key.key_prefix + "..." : key.key_prefix + "••••••••"}
                    </code>
                    <button
                      onClick={() => {
                        const newRevealed = new Set(revealedKeys);
                        if (newRevealed.has(key.id)) {
                          newRevealed.delete(key.id);
                        } else {
                          newRevealed.add(key.id);
                        }
                        setRevealedKeys(newRevealed);
                      }}
                      className="p-1.5 rounded hover:bg-zinc-800 transition"
                      title={revealedKeys.has(key.id) ? "הסתר" : "הצג"}
                    >
                      {revealedKeys.has(key.id) ? (
                        <EyeOff className="size-4 text-zinc-400" />
                      ) : (
                        <Eye className="size-4 text-zinc-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopy(key.key_prefix)}
                      className="p-1.5 rounded hover:bg-zinc-800 transition"
                      title="העתק"
                    >
                      <Copy className="size-4 text-zinc-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>נוצר: {new Date(key.created_at).toLocaleDateString("he-IL")}</span>
                    {key.last_used && (
                      <span>שימוש אחרון: {new Date(key.last_used).toLocaleDateString("he-IL")}</span>
                    )}
                    <span>שימושים: {key.usage_count}</span>
                  </div>
                </div>
                {key.status === "active" && (
                  <button
                    onClick={() => handleRevoke(key.id)}
                    className="p-2 rounded-lg border border-red-500/50 hover:bg-red-500/20 transition"
                    title="בטל מפתח"
                  >
                    <Trash2 className="size-4 text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-charcoal border border-zinc-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">צור מפתח API חדש</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">שם המפתח</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="לדוגמה: Production API"
                  className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
                />
              </div>
              <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-400">
                    <strong>אבטחה:</strong> המפתח יוצג פעם אחת בלבד. שמור אותו במקום בטוח.
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewKeyName("");
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  ביטול
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold/90 transition disabled:opacity-50"
                >
                  {creating ? "יוצר..." : "צור"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

