"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.ok && data.token) {
        // Save token to localStorage and cookie
        localStorage.setItem("admin_token", data.token);
        document.cookie = `admin_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        
        showToast("התחברות הצליחה!", "success");
        router.push("/admin");
      } else {
        setError(data.error || "שגיאה בהתחברות");
        showToast(data.error || "שגיאה בהתחברות", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("שגיאה בהתחברות");
      showToast("שגיאה בהתחברות", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-900/30 rounded-full mb-4">
              <Shield className="text-cyan-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">דשבורד מנהל</h1>
            <p className="text-gray-400 text-sm">התחבר עם חשבון מנהל</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="inline-block mr-2" size={16} />
                אימייל
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="admin@aegis-spectra.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock className="inline-block mr-2" size={16} />
                סיסמה
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="הזן סיסמה"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "מתחבר..." : "התחבר"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              משתמש רגיל? <a href="/account" className="text-cyan-400 hover:text-cyan-300">חשבון משתמש</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

