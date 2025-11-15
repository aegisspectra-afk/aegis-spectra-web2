"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Globe, Bell, Moon, Sun, Monitor, Eye, EyeOff, Lock, Trash2, Smartphone, Shield, CheckCircle, Settings, Key, Clock, Download, Database, CreditCard, FileText } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";
import { NotificationsCenter } from "./NotificationsCenter";
import { ActivityLog } from "./ActivityLog";
import { DeviceManagement } from "./DeviceManagement";
import { DataExport } from "./DataExport";
import { ApiKeysManagement } from "./ApiKeysManagement";
import { InvoicesList } from "./InvoicesList";
import { SubscriptionsManagement } from "./SubscriptionsManagement";
import { PaymentMethods } from "./PaymentMethods";
import { AdvancedReports } from "./AdvancedReports";
import { Integrations } from "./Integrations";

function TwoFactorAuthSection({ enabled, onToggle }: { enabled: boolean; onToggle: (enabled: boolean) => void }) {
  const { showToast } = useToastContext();
  const [showSetup, setShowSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationToken, setVerificationToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user/2fa/setup", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.ok) {
        setQrCode(data.qrCode);
        setSecret(data.manualEntryKey);
        setShowSetup(true);
      } else {
        showToast(data.error || "שגיאה בהגדרת 2FA", "error");
      }
    } catch (error) {
      showToast("שגיאה בהגדרת 2FA", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      showToast("אנא הזן קוד אימות בן 6 ספרות", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user/2fa/setup", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();
      if (data.ok) {
        showToast("2FA הופעל בהצלחה!", "success");
        setShowSetup(false);
        setVerificationToken("");
        onToggle(true);
      } else {
        showToast(data.error || "קוד אימות שגוי", "error");
      }
    } catch (error) {
      showToast("שגיאה באימות 2FA", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("האם אתה בטוח שברצונך להשבית את 2FA?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user/2fa/setup", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.ok) {
        showToast("2FA הושבת בהצלחה", "success");
        onToggle(false);
      } else {
        showToast(data.error || "שגיאה בהשבתת 2FA", "error");
      }
    } catch (error) {
      showToast("שגיאה בהשבתת 2FA", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-black/30">
        <div>
          <div className="font-semibold text-white flex items-center gap-2">
            אימות דו-שלבי (2FA)
            {enabled && <CheckCircle className="size-4 text-green-400" />}
          </div>
          <div className="text-sm text-zinc-400">הוסף שכבת אבטחה נוספת לחשבון שלך</div>
        </div>
        <button
          onClick={enabled ? handleDisable : handleSetup}
          disabled={loading}
          className={`relative w-12 h-6 rounded-full transition ${
            enabled ? "bg-gold" : "bg-zinc-700"
          } disabled:opacity-50`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
              enabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {showSetup && (
        <div className="p-4 rounded-lg border border-gold/30 bg-gold/10">
          <h4 className="font-semibold text-white mb-3">הגדרת 2FA</h4>
          <div className="space-y-4">
            <div className="text-sm text-zinc-300">
              <p className="mb-2">1. סרוק את ה-QR code באפליקציית האימות שלך (Google Authenticator, Authy, וכו')</p>
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded" />
                </div>
              )}
              <p className="mb-2">או הזן את המפתח ידנית:</p>
              <div className="bg-black/30 p-3 rounded font-mono text-xs break-all text-gold mb-4">
                {secret}
              </div>
              <p className="mb-2">2. הזן את קוד האימות בן 6 הספרות:</p>
              <input
                type="text"
                maxLength={6}
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-gold/70"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleVerify}
                  disabled={loading || verificationToken.length !== 6}
                  className="flex-1 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold/90 transition disabled:opacity-50"
                >
                  {loading ? "מאמת..." : "אמת והפעל"}
                </button>
                <button
                  onClick={() => {
                    setShowSetup(false);
                    setVerificationToken("");
                  }}
                  className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangePasswordButton() {
  const { showToast } = useToastContext();
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("יש למלא את כל השדות", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("סיסמה חדשה ואישור סיסמה לא תואמים", "error");
      return;
    }

    if (newPassword.length < 8) {
      showToast("סיסמה חייבת להכיל לפחות 8 תווים", "error");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (data.ok) {
        showToast("סיסמה עודכנה בהצלחה", "success");
        setShowModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.error || "שגיאה בעדכון סיסמה", "error");
      }
    } catch (error) {
      showToast("שגיאה בעדכון סיסמה", "error");
    } finally {
      setSaving(false);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-charcoal border border-zinc-800 rounded-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">שינוי סיסמה</h3>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-zinc-800 rounded-lg">
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">סיסמה נוכחית</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">סיסמה חדשה</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">אישור סיסמה</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
              >
                ביטול
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold/90 transition disabled:opacity-50"
              >
                {saving ? "שומר..." : "שמור"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowModal(true)}
      className="w-full flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-black/30 hover:border-gold/50 transition text-right"
    >
      <div>
        <div className="font-semibold text-white flex items-center gap-2">
          <Lock className="size-4" />
          שינוי סיסמה
        </div>
        <div className="text-sm text-zinc-400">עדכן את סיסמת החשבון שלך</div>
      </div>
    </button>
  );
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    email?: string;
    phone?: string;
  };
}

export function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
  const { showToast } = useToastContext();
  const [activeSection, setActiveSection] = useState<"general" | "notifications" | "privacy" | "security" | "account" | "advanced">("general");
  const [settings, setSettings] = useState({
    language: "he",
    theme: "dark",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: false,
    showPersonalInfo: true,
    twoFactorEnabled: false,
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("user_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem("user_settings", JSON.stringify(settings));
      
      // Apply theme immediately
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else if (settings.theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        // Auto - follow system
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
        }
      }

      showToast("הגדרות נשמרו בהצלחה", "success");
      setTimeout(() => onClose(), 500);
    } catch (error) {
      showToast("שגיאה בשמירת הגדרות", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ confirmEmail: user.email })
      });

      const data = await response.json();
      if (data.ok) {
        showToast("החשבון נמחק בהצלחה", "success");
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        showToast(data.error || "שגיאה במחיקת חשבון", "error");
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      showToast("שגיאה במחיקת חשבון", "error");
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-charcoal border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">הגדרות</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition"
          >
            <X className="size-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-l border-zinc-800 bg-black/30 p-4 space-y-2 overflow-y-auto">
            {[
              { id: "general" as const, label: "כללי", icon: Globe },
              { id: "notifications" as const, label: "התראות", icon: Bell },
              { id: "privacy" as const, label: "פרטיות", icon: Eye },
              { id: "security" as const, label: "אבטחה", icon: Shield },
              { id: "account" as const, label: "חשבון", icon: Smartphone },
              { id: "advanced" as const, label: "מתקדם", icon: Settings },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeSection === section.id
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <Icon className="size-5" />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === "general" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">הגדרות כלליות</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">שפה</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
                  >
                    <option value="he">עברית</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">נושא</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "dark", label: "כהה", icon: Moon },
                      { value: "light", label: "בהיר", icon: Sun },
                      { value: "auto", label: "אוטומטי", icon: Monitor },
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => setSettings({ ...settings, theme: theme.value as any })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition ${
                            settings.theme === theme.value
                              ? "border-gold bg-gold/10"
                              : "border-zinc-700 hover:border-zinc-600"
                          }`}
                        >
                          <Icon className="size-6 text-zinc-400" />
                          <span className="text-sm text-zinc-300">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">הגדרות התראות</h3>
                
                {[
                  { key: "emailNotifications", label: "התראות אימייל", desc: "קבל התראות במייל על הזמנות ועדכונים" },
                  { key: "smsNotifications", label: "התראות SMS", desc: "קבל התראות בהודעות טקסט" },
                  { key: "pushNotifications", label: "התראות Push", desc: "קבל התראות בדפדפן" },
                ].map((notif) => (
                  <div key={notif.key} className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-black/30">
                    <div>
                      <div className="font-semibold text-white">{notif.label}</div>
                      <div className="text-sm text-zinc-400">{notif.desc}</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, [notif.key]: !settings[notif.key as keyof typeof settings] })}
                      className={`relative w-12 h-6 rounded-full transition ${
                        settings[notif.key as keyof typeof settings] ? "bg-gold" : "bg-zinc-700"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                          settings[notif.key as keyof typeof settings] ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">הגדרות פרטיות</h3>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-black/30">
                  <div>
                    <div className="font-semibold text-white">הצגת מידע אישי</div>
                    <div className="text-sm text-zinc-400">הצג פרטים אישיים בפרופיל הציבורי</div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, showPersonalInfo: !settings.showPersonalInfo })}
                    className={`relative w-12 h-6 rounded-full transition ${
                      settings.showPersonalInfo ? "bg-gold" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                        settings.showPersonalInfo ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">אבטחה</h3>
                
                <div className="space-y-4">
                  <TwoFactorAuthSection 
                    enabled={settings.twoFactorEnabled}
                    onToggle={(enabled) => {
                      setSettings({ ...settings, twoFactorEnabled: enabled });
                      if (enabled) {
                        showToast("2FA הופעל בהצלחה", "success");
                      } else {
                        showToast("2FA הושבת בהצלחה", "success");
                      }
                    }}
                  />

                  <ChangePasswordButton />
                </div>
              </div>
            )}

            {activeSection === "account" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">חשבון</h3>
                
                {user.email && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <CreditCard className="size-5 text-gold" />
                        מנויים ותשלומים
                      </h4>
                      <SubscriptionsManagement userEmail={user.email} />
                      <div className="mt-4">
                        <PaymentMethods userEmail={user.email} />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <FileText className="size-5 text-gold" />
                        חשבוניות
                      </h4>
                      <InvoicesList userEmail={user.email} />
                    </div>
                  </div>
                )}
                
                <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                  <div className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <Trash2 className="size-5" />
                    מחיקת חשבון
                  </div>
                  <div className="text-sm text-zinc-400 mb-4">
                    מחיקת החשבון היא פעולה בלתי הפיכה. כל הנתונים יימחקו לצמיתות.
                  </div>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition"
                    >
                      מחק חשבון
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-400">האם אתה בטוח? פעולה זו אינה בלתי הפיכה.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          כן, מחק
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                        >
                          ביטול
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === "advanced" && user.email && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">הגדרות מתקדמות</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Bell className="size-5 text-gold" />
                      התראות
                    </h4>
                    <NotificationsCenter userEmail={user.email} />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Clock className="size-5 text-gold" />
                      היסטוריית פעילות
                    </h4>
                    <ActivityLog userEmail={user.email} />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Smartphone className="size-5 text-gold" />
                      ניהול מכשירים
                    </h4>
                    <DeviceManagement userEmail={user.email} />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Key className="size-5 text-gold" />
                      API Keys
                    </h4>
                    <ApiKeysManagement userEmail={user.email} />
                  </div>

                         <div>
                           <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                             <Download className="size-5 text-gold" />
                             ייצוא נתונים
                           </h4>
                           <DataExport userEmail={user.email} />
                         </div>

                         <div>
                           <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                             <FileText className="size-5 text-gold" />
                             דוחות מתקדמים
                           </h4>
                           <AdvancedReports userEmail={user.email} />
                         </div>

                         <div>
                           <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                             <Key className="size-5 text-gold" />
                             אינטגרציות
                           </h4>
                           <Integrations userEmail={user.email} />
                         </div>
                       </div>
                     </div>
                   )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold/90 transition disabled:opacity-50"
          >
            {saving ? "שומר..." : "שמור שינויים"}
          </button>
        </div>
      </div>
    </div>
  );
}

