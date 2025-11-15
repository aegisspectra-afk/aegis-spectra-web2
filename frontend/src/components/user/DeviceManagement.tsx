"use client";

import { useState, useEffect } from "react";
import { Smartphone, Monitor, Tablet, X, AlertCircle } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface Device {
  id: string;
  name: string;
  type: "mobile" | "desktop" | "tablet";
  browser: string;
  os: string;
  last_active: string;
  current: boolean;
  ip_address?: string;
}

interface DeviceManagementProps {
  userEmail?: string;
}

export function DeviceManagement({ userEmail }: DeviceManagementProps) {
  const { showToast } = useToastContext();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      fetchDevices();
    }
  }, [userEmail]);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `/api/user/devices?user_email=${encodeURIComponent(userEmail || "")}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.ok && data.devices) {
        setDevices(data.devices);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (deviceId: string) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/devices/${deviceId}/revoke`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (data.ok) {
        setDevices(devices.filter(d => d.id !== deviceId));
        showToast("מכשיר נותק בהצלחה", "success");
      } else {
        showToast(data.error || "שגיאה בניתוק מכשיר", "error");
      }
    } catch (error) {
      showToast("שגיאה בניתוק מכשיר", "error");
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="size-5 text-blue-400" />;
      case "tablet":
        return <Tablet className="size-5 text-purple-400" />;
      case "desktop":
        return <Monitor className="size-5 text-green-400" />;
      default:
        return <Monitor className="size-5 text-zinc-400" />;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען מכשירים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Smartphone className="size-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">ניהול מכשירים</h2>
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-12">
          <Smartphone className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין מכשירים מחוברים</p>
          <p className="text-sm text-zinc-500">כל המכשירים המחוברים יופיעו כאן</p>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`rounded-xl border p-4 ${
                device.current
                  ? "border-gold/50 bg-gold/5"
                  : "border-zinc-800 bg-black/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getDeviceIcon(device.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{device.name}</h3>
                      {device.current && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gold/20 text-gold">
                          נוכחי
                        </span>
                      )}
                    </div>
                    {!device.current && (
                      <button
                        onClick={() => handleRevoke(device.id)}
                        className="p-1.5 rounded hover:bg-red-500/20 transition"
                        title="נתק מכשיר"
                      >
                        <X className="size-4 text-red-400" />
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    {device.browser} • {device.os}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      פעילות אחרונה: {new Date(device.last_active).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {device.ip_address && (
                      <span className="text-xs text-zinc-600">
                        IP: {device.ip_address}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {devices.length > 1 && (
        <div className="mt-6 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-400 mb-1">אבטחה</div>
              <div className="text-sm text-zinc-400">
                אם אתה מזהה מכשיר לא מוכר, נתק אותו מיד. זה יכול להיות ניסיון גישה לא מורשה לחשבון שלך.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

