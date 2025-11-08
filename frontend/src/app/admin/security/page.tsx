'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Key, Globe, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface IPWhitelist {
  id: number;
  ip_address: string;
  description?: string;
  created_at: string;
}

interface TwoFactorUser {
  id: number;
  email: string;
  name: string;
  two_factor_enabled: boolean;
  last_login?: string;
}

export default function AdminSecurityPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [activeTab, setActiveTab] = useState<'2fa' | 'ip'>('2fa');
  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelist[]>([]);
  const [twoFactorUsers, setTwoFactorUsers] = useState<TwoFactorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIPForm, setShowIPForm] = useState(false);
  const [ipFormData, setIpFormData] = useState({
    ip_address: '',
    description: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData(token);
  }, [router, activeTab]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      if (activeTab === 'ip') {
        const res = await fetch('/api/admin/security/ip-whitelist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok) {
          setIpWhitelist(data.ips || []);
        }
      } else {
        const res = await fetch('/api/admin/security/2fa', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok) {
          setTwoFactorUsers(data.users || []);
        }
      }
    } catch (err) {
      console.error('Error fetching security data:', err);
      showToast('שגיאה בטעינת נתוני אבטחה', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch('/api/admin/security/ip-whitelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ipFormData),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('כתובת IP נוספה בהצלחה', 'success');
        setShowIPForm(false);
        setIpFormData({ ip_address: '', description: '' });
        fetchData(token);
      } else {
        showToast(data.error || 'שגיאה בהוספת כתובת IP', 'error');
      }
    } catch (err) {
      console.error('Error adding IP:', err);
      showToast('שגיאה בהוספת כתובת IP', 'error');
    }
  };

  const handleDeleteIP = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את כתובת ה-IP הזו?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/security/ip-whitelist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('כתובת IP נמחקה בהצלחה', 'success');
        fetchData(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת כתובת IP', 'error');
      }
    } catch (err) {
      console.error('Error deleting IP:', err);
      showToast('שגיאה במחיקת כתובת IP', 'error');
    }
  };

  const handleToggle2FA = async (userId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/security/2fa/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast(`2FA ${!currentStatus ? 'הופעל' : 'הושבת'} בהצלחה`, 'success');
        fetchData(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון 2FA', 'error');
      }
    } catch (err) {
      console.error('Error updating 2FA:', err);
      showToast('שגיאה בעדכון 2FA', 'error');
    }
  };

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="size-8 text-gold" />
            ניהול אבטחה
          </h1>
          <p className="text-zinc-400">2FA ו-IP Whitelisting</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('2fa')}
            className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
              activeTab === '2fa'
                ? 'text-gold border-b-2 border-gold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="size-5" />
            אימות דו-שלבי (2FA)
          </button>
          <button
            onClick={() => setActiveTab('ip')}
            className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
              activeTab === 'ip'
                ? 'text-gold border-b-2 border-gold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="size-5" />
            IP Whitelist
          </button>
        </div>

        {/* 2FA Tab */}
        {activeTab === '2fa' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתמש</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס 2FA</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">כניסה אחרונה</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {twoFactorUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                        אין משתמשים להצגה
                      </td>
                    </tr>
                  ) : (
                    twoFactorUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-sm text-zinc-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 w-fit ${
                            user.two_factor_enabled
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.two_factor_enabled ? (
                              <>
                                <CheckCircle className="size-4" />
                                מופעל
                              </>
                            ) : (
                              <>
                                <XCircle className="size-4" />
                                מושבת
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-zinc-400">
                            {user.last_login
                              ? new Date(user.last_login).toLocaleDateString('he-IL')
                              : 'אין כניסות'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggle2FA(user.id, user.two_factor_enabled)}
                            className={`px-3 py-1 rounded text-sm font-semibold transition ${
                              user.two_factor_enabled
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {user.two_factor_enabled ? 'השבת' : 'הפעל'}
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

        {/* IP Whitelist Tab */}
        {activeTab === 'ip' && (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowIPForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
              >
                <Plus className="size-5" />
                הוסף IP
              </button>
            </div>

            {/* Form Modal */}
            {showIPForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">הוסף כתובת IP</h2>
                  <form onSubmit={handleAddIP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">כתובת IP *</label>
                      <input
                        type="text"
                        value={ipFormData.ip_address}
                        onChange={(e) => setIpFormData({ ...ipFormData, ip_address: e.target.value })}
                        required
                        placeholder="192.168.1.1"
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">תיאור</label>
                      <input
                        type="text"
                        value={ipFormData.description}
                        onChange={(e) => setIpFormData({ ...ipFormData, description: e.target.value })}
                        placeholder="משרד ראשי"
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
                      >
                        הוסף
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowIPForm(false);
                          setIpFormData({ ip_address: '', description: '' });
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

            {/* IP Whitelist Table */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">כתובת IP</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תיאור</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">נוסף ב-</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {ipWhitelist.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                          אין כתובות IP ברשימה
                        </td>
                      </tr>
                    ) : (
                      ipWhitelist.map((ip) => (
                        <tr key={ip.id} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="px-6 py-4">
                            <code className="text-white font-mono bg-zinc-900 px-2 py-1 rounded">
                              {ip.ip_address}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-zinc-300">{ip.description || '-'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-zinc-400">
                              {new Date(ip.created_at).toLocaleDateString('he-IL')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteIP(ip.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

