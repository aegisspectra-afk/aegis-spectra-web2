'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Send, Settings, Users, Calendar } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface PushConfig {
  provider: string;
  api_key?: string;
  is_active: boolean;
}

interface PushLog {
  id: number;
  user_id?: number;
  title: string;
  message: string;
  status: string;
  sent_at: string;
}

export default function AdminPushNotificationsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [config, setConfig] = useState<PushConfig>({
    provider: 'firebase',
    is_active: false,
  });
  const [logs, setLogs] = useState<PushLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'config' | 'send' | 'logs'>('config');
  const [sendForm, setSendForm] = useState({
    user_id: '',
    title: '',
    message: '',
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
      const [configRes, logsRes] = await Promise.all([
        fetch('/api/admin/push/config', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/push/logs', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const configData = await configRes.json();
      const logsData = await logsRes.json();

      if (configData.ok) {
        setConfig(configData.config || config);
      }
      if (logsData.ok) {
        setLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Error fetching push data:', err);
      showToast('שגיאה בטעינת נתוני Push', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch('/api/admin/push/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('הגדרות Push נשמרו בהצלחה', 'success');
        fetchData(token);
      } else {
        showToast(data.error || 'שגיאה בשמירת הגדרות', 'error');
      }
    } catch (err) {
      console.error('Error saving config:', err);
      showToast('שגיאה בשמירת הגדרות', 'error');
    }
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch('/api/admin/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...sendForm,
          user_id: sendForm.user_id ? parseInt(sendForm.user_id) : null,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('Push נשלח בהצלחה', 'success');
        setSendForm({ user_id: '', title: '', message: '' });
        fetchData(token);
      } else {
        showToast(data.error || 'שגיאה בשליחת Push', 'error');
      }
    } catch (err) {
      console.error('Error sending push:', err);
      showToast('שגיאה בשליחת Push', 'error');
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
            <Bell className="size-8 text-gold" />
            ניהול Push Notifications
          </h1>
          <p className="text-zinc-400">שליחה וניהול התראות Push</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
              activeTab === 'config'
                ? 'text-gold border-b-2 border-gold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="size-5" />
            הגדרות
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
              activeTab === 'send'
                ? 'text-gold border-b-2 border-gold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Send className="size-5" />
            שלח Push
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'text-gold border-b-2 border-gold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bell className="size-5" />
            יומן התראות
          </button>
        </div>

        {/* Config Tab */}
        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-black/30 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">ספק Push *</label>
              <select
                value={config.provider}
                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                required
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="firebase">Firebase Cloud Messaging</option>
                <option value="onesignal">OneSignal</option>
                <option value="pusher">Pusher</option>
                <option value="custom">מותאם אישית</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input
                type="text"
                value={config.api_key || ''}
                onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="הכנס API Key"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.is_active}
                onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm">פעיל</label>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
            >
              שמור הגדרות
            </button>
          </form>
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <form onSubmit={handleSendPush} className="bg-black/30 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">ID משתמש (אופציונלי - השאר ריק לכל המשתמשים)</label>
              <input
                type="number"
                value={sendForm.user_id}
                onChange={(e) => setSendForm({ ...sendForm, user_id: e.target.value })}
                placeholder="ID משתמש"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">כותרת *</label>
              <input
                type="text"
                value={sendForm.title}
                onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
                required
                placeholder="כותרת ההתראה"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">הודעה *</label>
              <textarea
                value={sendForm.message}
                onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                required
                rows={6}
                placeholder="תוכן ההתראה"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition flex items-center justify-center gap-2"
            >
              <Send className="size-5" />
              שלח Push
            </button>
          </form>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">כותרת</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הודעה</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">משתמש</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">נשלח ב-</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                        אין התראות להצגה
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">{log.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <span className="text-zinc-300 text-sm line-clamp-2">{log.message}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {log.user_id ? (
                            <div className="flex items-center gap-2">
                              <Users className="size-4 text-zinc-400" />
                              <span className="text-zinc-300">#{log.user_id}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-400">כל המשתמשים</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            log.status === 'sent'
                              ? 'bg-green-500/20 text-green-400'
                              : log.status === 'failed'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {log.status === 'sent' ? 'נשלח' :
                             log.status === 'failed' ? 'נכשל' : 'ממתין'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-zinc-400" />
                            <span className="text-sm text-zinc-400">
                              {new Date(log.sent_at).toLocaleString('he-IL')}
                            </span>
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
      </div>
    </div>
  );
}

