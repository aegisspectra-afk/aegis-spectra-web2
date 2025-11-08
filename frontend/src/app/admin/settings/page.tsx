/**
 * Admin Settings Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, Mail, CreditCard, Truck, Globe, Bell } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface SettingsData {
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_password: string;
    from_email: string;
    from_name: string;
  };
  payment: {
    provider: string;
    api_key: string;
    test_mode: boolean;
  };
  shipping: {
    default_cost: number;
    free_shipping_threshold: number;
    express_cost: number;
  };
  general: {
    site_name: string;
    site_url: string;
    currency: string;
    timezone: string;
  };
  notifications: {
    email_enabled: boolean;
    sms_enabled: boolean;
    low_stock_alerts: boolean;
    new_order_alerts: boolean;
  };
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    email: {
      smtp_host: '',
      smtp_port: 587,
      smtp_user: '',
      smtp_password: '',
      from_email: '',
      from_name: 'Aegis Spectra',
    },
    payment: {
      provider: 'paypal',
      api_key: '',
      test_mode: true,
    },
    shipping: {
      default_cost: 500,
      free_shipping_threshold: 5000,
      express_cost: 1000,
    },
    general: {
      site_name: 'Aegis Spectra',
      site_url: 'https://aegis-spectra.netlify.app',
      currency: 'ILS',
      timezone: 'Asia/Jerusalem',
    },
    notifications: {
      email_enabled: true,
      sms_enabled: false,
      low_stock_alerts: true,
      new_order_alerts: true,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchSettings(token);
  }, [router]);

  const fetchSettings = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok && data.settings) {
        setSettings({ ...settings, ...data.settings });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      
      if (data.ok) {
        showToast('הגדרות נשמרו בהצלחה', 'success');
      } else {
        showToast(data.error || 'שגיאה בשמירת הגדרות', 'error');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('שגיאה בשמירת הגדרות', 'error');
    } finally {
      setSaving(false);
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
          <h1 className="text-4xl font-bold mb-2">הגדרות מערכת</h1>
          <p className="text-zinc-400">ניהול הגדרות המערכת</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Globe className="size-6 text-gold" />
              הגדרות כלליות
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">שם האתר</label>
                <input
                  type="text"
                  value={settings.general.site_name}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, site_name: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">כתובת האתר</label>
                <input
                  type="url"
                  value={settings.general.site_url}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, site_url: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">מטבע</label>
                <select
                  value={settings.general.currency}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, currency: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                >
                  <option value="ILS">₪ ILS</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">אזור זמן</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, timezone: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                >
                  <option value="Asia/Jerusalem">ישראל (Asia/Jerusalem)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="size-6 text-gold" />
              הגדרות אימייל
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">SMTP Host</label>
                <input
                  type="text"
                  value={settings.email.smtp_host}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, smtp_host: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">SMTP Port</label>
                <input
                  type="number"
                  value={settings.email.smtp_port}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, smtp_port: parseInt(e.target.value) || 587 }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">SMTP User</label>
                <input
                  type="text"
                  value={settings.email.smtp_user}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, smtp_user: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">SMTP Password</label>
                <input
                  type="password"
                  value={settings.email.smtp_password}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, smtp_password: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">From Email</label>
                <input
                  type="email"
                  value={settings.email.from_email}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, from_email: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">From Name</label>
                <input
                  type="text"
                  value={settings.email.from_name}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, from_name: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="size-6 text-gold" />
              הגדרות תשלום
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">ספק תשלום</label>
                <select
                  value={settings.payment.provider}
                  onChange={(e) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, provider: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                >
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                  <option value="credit_card">כרטיס אשראי</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">API Key</label>
                <input
                  type="password"
                  value={settings.payment.api_key}
                  onChange={(e) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, api_key: e.target.value }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payment.test_mode}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, test_mode: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-zinc-300">מצב בדיקה</span>
                </label>
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Truck className="size-6 text-gold" />
              הגדרות משלוח
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">עלות משלוח רגיל (₪)</label>
                <input
                  type="number"
                  value={settings.shipping.default_cost}
                  onChange={(e) => setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, default_cost: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">סף משלוח חינם (₪)</label>
                <input
                  type="number"
                  value={settings.shipping.free_shipping_threshold}
                  onChange={(e) => setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, free_shipping_threshold: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">עלות משלוח מהיר (₪)</label>
                <input
                  type="number"
                  value={settings.shipping.express_cost}
                  onChange={(e) => setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, express_cost: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
                />
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Bell className="size-6 text-gold" />
              הגדרות התראות
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email_enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email_enabled: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
                <span className="text-zinc-300">התראות אימייל</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms_enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, sms_enabled: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
                <span className="text-zinc-300">התראות SMS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.low_stock_alerts}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, low_stock_alerts: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
                <span className="text-zinc-300">התראות מלאי נמוך</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.new_order_alerts}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, new_order_alerts: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
                <span className="text-zinc-300">התראות הזמנות חדשות</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold/90 transition disabled:opacity-50"
            >
              <Save className="size-5" />
              {saving ? 'שומר...' : 'שמור הגדרות'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

