'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Plus, Edit, Trash2, Users, CheckSquare } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  users_count: number;
  created_at: string;
}

export default function AdminPermissionsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const [rolesRes, usersRes] = await Promise.all([
        fetch('/api/admin/permissions/roles', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const rolesData = await rolesRes.json();
      const usersData = await usersRes.json();

      if (rolesData.ok) {
        setRoles(rolesData.roles || []);
      }
      if (usersData.ok) {
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast('שגיאה בטעינת נתונים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const url = editingRole
        ? `/api/admin/permissions/roles/${editingRole.id}`
        : '/api/admin/permissions/roles';
      const method = editingRole ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(editingRole ? 'תפקיד עודכן בהצלחה' : 'תפקיד נוצר בהצלחה', 'success');
        setShowForm(false);
        setEditingRole(null);
        resetForm();
        fetchData(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת תפקיד', 'error');
      }
    } catch (err) {
      console.error('Error saving role:', err);
      showToast('שגיאה בשמירת תפקיד', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את התפקיד הזה?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/permissions/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('תפקיד נמחק בהצלחה', 'success');
        fetchData(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת תפקיד', 'error');
      }
    } catch (err) {
      console.error('Error deleting role:', err);
      showToast('שגיאה במחיקת תפקיד', 'error');
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
    });
    setShowForm(true);
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
  };

  const allPermissions = [
    { category: 'הזמנות', permissions: ['orders:read', 'orders:write', 'orders:delete', 'orders:update_status'] },
    { category: 'מוצרים', permissions: ['products:read', 'products:write', 'products:delete', 'products:update'] },
    { category: 'משתמשים', permissions: ['users:read', 'users:write', 'users:delete', 'users:update_role'] },
    { category: 'מלאי', permissions: ['inventory:read', 'inventory:write', 'inventory:adjust'] },
    { category: 'אנליטיקה', permissions: ['analytics:read', 'analytics:export'] },
    { category: 'הגדרות', permissions: ['settings:read', 'settings:write'] },
    { category: 'תמיכה', permissions: ['support:read', 'support:write', 'support:delete'] },
    { category: 'בלוג', permissions: ['blog:read', 'blog:write', 'blog:delete'] },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-zinc-400">טוען...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Shield className="size-8 text-gold" />
              ניהול הרשאות ותפקידים
            </h1>
            <p className="text-zinc-400">יצירה וניהול תפקידים והרשאות</p>
          </div>
          {activeTab === 'roles' && (
            <button
              onClick={() => {
                resetForm();
                setEditingRole(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
            >
              <Plus className="size-5" />
              תפקיד חדש
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'roles'
                ? 'text-gold border-b-2 border-gold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            תפקידים
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'users'
                ? 'text-gold border-b-2 border-gold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            משתמשים
          </button>
        </div>

        {/* Form Modal */}
        {showForm && activeTab === 'roles' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingRole ? 'ערוך תפקיד' : 'תפקיד חדש'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">שם תפקיד *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">תיאור</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-4">הרשאות *</label>
                  <div className="space-y-4">
                    {allPermissions.map((category) => (
                      <div key={category.category} className="border border-zinc-700 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">{category.category}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {category.permissions.map((perm) => (
                            <label key={perm} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                                className="rounded"
                              />
                              <span className="text-sm">{perm}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
                  >
                    {editingRole ? 'עדכן' : 'צור'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingRole(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border-2 border-zinc-700 rounded-lg font-semibold hover:bg-zinc-800 transition"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תיאור</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הרשאות</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתמשים</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                        אין תפקידים להצגה
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{role.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-zinc-300">{role.description || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {role.permissions?.slice(0, 3).map((p, idx) => (
                              <span key={idx} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
                                {p}
                              </span>
                            ))}
                            {role.permissions && role.permissions.length > 3 && (
                              <span className="text-xs text-zinc-400">+{role.permissions.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white">{role.users_count || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(role)}
                              className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                            >
                              <Edit className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(role.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתמש</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תפקיד</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הרשאות</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                        אין משתמשים להצגה
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{user.name || user.email}</div>
                          <div className="text-sm text-zinc-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-zinc-300">{user.role || 'user'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-zinc-400 text-sm">
                            {user.permissions?.length || 0} הרשאות
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              // Navigate to user edit page
                              router.push(`/admin/users/${user.id}`);
                            }}
                            className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                          >
                            <Edit className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

