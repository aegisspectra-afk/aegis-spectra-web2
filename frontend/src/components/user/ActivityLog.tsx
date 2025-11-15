"use client";

import { useState, useEffect } from "react";
import { Clock, LogIn, User, Package, Gift, Settings, Shield } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  type: "login" | "profile" | "order" | "loyalty" | "security" | "other";
  details?: string;
  ip_address?: string;
  created_at: string;
}

interface ActivityLogProps {
  userEmail?: string;
}

export function ActivityLog({ userEmail }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (userEmail) {
      fetchActivities();
    }
  }, [userEmail, filter]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `/api/user/activity?user_email=${encodeURIComponent(userEmail || "")}&filter=${filter}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.ok && data.activities) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="size-5 text-green-400" />;
      case "profile":
        return <User className="size-5 text-blue-400" />;
      case "order":
        return <Package className="size-5 text-yellow-400" />;
      case "loyalty":
        return <Gift className="size-5 text-purple-400" />;
      case "security":
        return <Shield className="size-5 text-red-400" />;
      default:
        return <Clock className="size-5 text-zinc-400" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "login":
        return "כניסה";
      case "profile":
        return "פרופיל";
      case "order":
        return "הזמנה";
      case "loyalty":
        return "נאמנות";
      case "security":
        return "אבטחה";
      default:
        return "אחר";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען פעילות...</p>
        </div>
      </div>
    );
  }

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.type === filter);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="size-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">היסטוריית פעילות</h2>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold/70"
        >
          <option value="all">הכל</option>
          <option value="login">כניסות</option>
          <option value="profile">פרופיל</option>
          <option value="order">הזמנות</option>
          <option value="loyalty">נאמנות</option>
          <option value="security">אבטחה</option>
        </select>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין פעילות להצגה</p>
          <p className="text-sm text-zinc-500">כל הפעולות החשובות יופיעו כאן</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl border border-zinc-800 bg-black/20 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{activity.action}</h3>
                      <span className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400">
                        {getActivityTypeLabel(activity.type)}
                      </span>
                    </div>
                  </div>
                  {activity.details && (
                    <p className="text-sm text-zinc-400 mb-2">{activity.details}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {new Date(activity.created_at).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {activity.ip_address && (
                      <span className="text-xs text-zinc-600">
                        IP: {activity.ip_address}
                      </span>
                    )}
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

