/**
 * Admin Create User Page
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, User, Mail, Phone, Shield } from 'lucide-react';
import Link from 'next/link';
import { useToastContext } from '@/components/ToastProvider';

export default function AdminCreateUserPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as 'customer' | 'support' | 'manager' | 'admin' | 'super_admin',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.ok) {
        showToast('משתמש נוצר בהצלחה', 'success');
        router.push('/admin/users');
      } else {
        showToast(data.error || 'שגיאה ביצירת משתמש', 'error');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      showToast('שגיאה ביצירת משתמש', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition mb-4"
          >
            <ArrowRight className="size-4" />
            חזרה לרשימת משתמשים
          </Link>
          <h1 className="text-4xl font-bold mb-2">יצירת משתמש חדש</h1>
          <p className="text-zinc-400">הוסף משתמש חדש למערכת</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-black/30 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
              <User className="size-4" />
              שם מלא *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
              <Mail className="size-4" />
              אימייל *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
              <Phone className="size-4" />
              טלפון *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              סיסמה *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
              required
              minLength={8}
            />
            <p className="text-xs text-zinc-500 mt-1">מינימום 8 תווים</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
              <Shield className="size-4" />
              תפקיד *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              required
            >
              <option value="customer">לקוח</option>
              <option value="support">תמיכה</option>
              <option value="manager">מנהל</option>
              <option value="admin">אדמין</option>
              <option value="super_admin">סופר אדמין</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-zinc-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold/90 transition disabled:opacity-50"
            >
              <Save className="size-5" />
              {loading ? 'יוצר...' : 'צור משתמש'}
            </button>
            <Link
              href="/admin/users"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-zinc-700 rounded-xl font-semibold hover:bg-zinc-800 transition"
            >
              ביטול
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

