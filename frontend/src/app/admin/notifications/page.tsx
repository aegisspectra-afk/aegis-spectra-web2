/**
 * Admin Notifications Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCircle, X, AlertCircle, Info, Mail, MessageSquare } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchNotifications(token);
  }, [router, filter]);

  const fetchNotifications = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('read', filter === 'read' ? 'true' : 'false');
      }

      const res = await fetch(`/api/admin/notifications?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setNotifications(data.notifications || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת התראות', 'error');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      showToast('שגיאה בטעינת התראות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch('/api/admin/notifications/read-all', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('כל ההתראות סומנו כנקראו', 'success');
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
      showToast('שגיאה בסימון התראות', 'error');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return X;
      default:
        return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">התראות</h1>
              <p className="text-zinc-400">
                {unreadCount > 0 ? `${unreadCount} התראות לא נקראו` : 'אין התראות חדשות'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
              >
                סמן הכל כנקרא
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                filter === f
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {f === 'all' ? 'הכל' : f === 'unread' ? 'לא נקראו' : 'נקראו'}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`bg-black/30 border rounded-xl p-6 transition-all ${
                    notification.read 
                      ? 'border-zinc-800 opacity-60' 
                      : `${getColor(notification.type)} border-2`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-3 ${getColor(notification.type)}`}>
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{notification.title}</h3>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-zinc-400 hover:text-gold transition text-sm"
                          >
                            סמן כנקרא
                          </button>
                        )}
                      </div>
                      <p className="text-zinc-300 mb-3">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          {new Date(notification.created_at).toLocaleString('he-IL')}
                        </span>
                        {notification.action_url && (
                          <a
                            href={notification.action_url}
                            className="text-sm text-gold hover:text-gold/80 transition"
                          >
                            צפה →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-black/30 border border-zinc-800 rounded-xl">
            <Bell className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין התראות</p>
          </div>
        )}
      </div>
    </div>
  );
}

