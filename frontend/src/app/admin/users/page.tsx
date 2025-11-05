"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Edit, Trash2, Shield, UserCheck, Mail, Phone } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthAndFetchUsers();
  }, []);

  const checkAuthAndFetchUsers = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchUsers(token);
  };

  const fetchUsers = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.error || "שגיאה בטעינת משתמשים");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("שגיאה בטעינת משתמשים");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (data.ok) {
        showToast("תפקיד עודכן בהצלחה", "success");
        fetchUsers(token);
      } else {
        showToast(data.error || "שגיאה בעדכון תפקיד", "error");
      }
    } catch (err) {
      console.error("Error updating role:", err);
      showToast("שגיאה בעדכון תפקיד", "error");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-900/30 text-red-400 border-red-500";
      case "admin":
        return "bg-purple-900/30 text-purple-400 border-purple-500";
      case "manager":
        return "bg-blue-900/30 text-blue-400 border-blue-500";
      case "support":
        return "bg-green-900/30 text-green-400 border-green-500";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "מנהל ראשי";
      case "admin":
        return "מנהל";
      case "manager":
        return "מנהל משנה";
      case "support":
        return "תמיכה";
      case "customer":
        return "לקוח";
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">ניהול משתמשים</h1>
            <p className="text-gray-400">ניהול משתמשים והרשאות</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              משתמש חדש
            </button>
            <button
              onClick={() => {
                const token = localStorage.getItem("admin_token");
                if (token) fetchUsers(token);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              רענן
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              חזרה לדשבורד
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">משתמש</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">תפקיד</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">סטטוס</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">תאריך הרשמה</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          <Mail size={14} />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          <Phone size={14} />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className={`px-3 py-1 rounded border text-sm font-medium ${getRoleBadgeColor(user.role)} bg-gray-700`}
                      >
                        <option value="customer">לקוח</option>
                        <option value="support">תמיכה</option>
                        <option value="manager">מנהל משנה</option>
                        <option value="admin">מנהל</option>
                        <option value="super_admin">מנהל ראשי</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.email_verified ? (
                          <span className="flex items-center gap-1 text-green-400 text-sm">
                            <UserCheck size={14} />
                            מאומת
                          </span>
                        ) : (
                          <span className="text-yellow-400 text-sm">לא מאומת</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-cyan-400 hover:bg-cyan-900/20 rounded transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            <Users className="mx-auto mb-4 text-gray-500" size={48} />
            <p>אין משתמשים</p>
          </div>
        )}
      </div>
    </main>
  );
}

