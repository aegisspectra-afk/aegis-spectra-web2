"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, Package, Gift, MessageSquare, AlertCircle, Info } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface Notification {
  id: string;
  type: "order" | "loyalty" | "support" | "system" | "promotion";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

interface NotificationsCenterProps {
  userEmail?: string;
  limit?: number;
  showHeader?: boolean;
}

export function NotificationsCenter({ userEmail, limit, showHeader = true }: NotificationsCenterProps) {
  const { showToast } = useToastContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/user/notifications?user_email=${encodeURIComponent(userEmail || "")}`);
      const data = await response.json();
      if (data.ok && data.notifications) {
        const notifications = limit ? data.notifications.slice(0, limit) : data.notifications;
        setNotifications(notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/notifications/${id}/read`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/notifications/read-all`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        showToast("כל ההתראות סומנו כנקראו", "success");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="size-5 text-blue-400" />;
      case "loyalty":
        return <Gift className="size-5 text-yellow-400" />;
      case "support":
        return <MessageSquare className="size-5 text-green-400" />;
      case "system":
        return <Info className="size-5 text-zinc-400" />;
      case "promotion":
        return <AlertCircle className="size-5 text-gold" />;
      default:
        return <Bell className="size-5 text-zinc-400" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "order":
        return "הזמנה";
      case "loyalty":
        return "נאמנות";
      case "support":
        return "תמיכה";
      case "system":
        return "מערכת";
      case "promotion":
        return "מבצע";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען התראות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${showHeader ? 'rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm' : ''}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="size-6 text-gold" />
            <h2 className="text-2xl font-bold text-white">מרכז הודעות</h2>
            {unreadCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-semibold">
                {unreadCount} חדשות
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition text-sm"
            >
              סמן הכל כנקרא
            </button>
          )}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין התראות</p>
          <p className="text-sm text-zinc-500">כל ההתראות החשובות יופיעו כאן</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border p-4 transition ${
                notification.read
                  ? "border-zinc-800 bg-black/20 opacity-60"
                  : "border-zinc-700 bg-black/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{notification.title}</h3>
                      <span className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400">
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="size-2 rounded-full bg-gold flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {new Date(notification.created_at).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 rounded hover:bg-zinc-800 transition"
                          title="סמן כנקרא"
                        >
                          <Check className="size-4 text-zinc-400" />
                        </button>
                      )}
                      {notification.action_url && (
                        <a
                          href={notification.action_url}
                          className="px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-sm hover:bg-gold/30 transition"
                        >
                          צפה
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

