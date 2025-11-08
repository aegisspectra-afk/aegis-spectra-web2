'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Download, Upload, Calendar, HardDrive, Clock } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Backup {
  id: number;
  name: string;
  type: string;
  size: number;
  status: string;
  created_at: string;
}

export default function AdminBackupPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBackups(token);
  }, [router]);

  const fetchBackups = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/backup', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setBackups(data.backups || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת גיבויים', 'error');
      }
    } catch (err) {
      console.error('Error fetching backups:', err);
      showToast('שגיאה בטעינת גיבויים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!confirm('האם אתה בטוח שברצונך ליצור גיבוי חדש?')) return;

    setCreating(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('גיבוי נוצר בהצלחה', 'success');
        fetchBackups(token);
      } else {
        showToast(data.error || 'שגיאה ביצירת גיבוי', 'error');
      }
    } catch (err) {
      console.error('Error creating backup:', err);
      showToast('שגיאה ביצירת גיבוי', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/backup/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${id}.sql`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('גיבוי הורד בהצלחה', 'success');
      } else {
        showToast('שגיאה בהורדת גיבוי', 'error');
      }
    } catch (err) {
      console.error('Error downloading backup:', err);
      showToast('שגיאה בהורדת גיבוי', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך לשחזר את הגיבוי הזה? פעולה זו תדרוס את כל הנתונים הנוכחיים!')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/backup/${id}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('גיבוי שוחזר בהצלחה', 'success');
      } else {
        showToast(data.error || 'שגיאה בשחזור גיבוי', 'error');
      }
    } catch (err) {
      console.error('Error restoring backup:', err);
      showToast('שגיאה בשחזור גיבוי', 'error');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Database className="size-8 text-gold" />
              ניהול גיבויים
            </h1>
            <p className="text-zinc-400">יצירה, הורדה ושחזור גיבויים</p>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition disabled:opacity-50"
          >
            <Database className="size-5" />
            {creating ? 'יוצר...' : 'צור גיבוי'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="size-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{backups.length}</span>
            </div>
            <p className="text-zinc-400 text-sm">סה&quot;כ גיבויים</p>
          </div>
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="size-8 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {backups.length > 0
                  ? new Date(backups[0].created_at).toLocaleDateString('he-IL')
                  : 'אין'}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">גיבוי אחרון</p>
          </div>
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Database className="size-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">
                {formatFileSize(backups.reduce((sum, b) => sum + b.size, 0))}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">סה&quot;כ נפח</p>
          </div>
        </div>

        {/* Backups Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סוג</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">גודל</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">נוצר ב-</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {backups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                      אין גיבויים להצגה
                    </td>
                  </tr>
                ) : (
                  backups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{backup.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{backup.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{formatFileSize(backup.size)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          backup.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : backup.status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {backup.status === 'completed' ? 'הושלם' :
                           backup.status === 'failed' ? 'נכשל' : 'בתהליך'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-zinc-400" />
                          <span className="text-sm text-zinc-400">
                            {new Date(backup.created_at).toLocaleString('he-IL')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(backup.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Download className="size-4" />
                            הורד
                          </button>
                          <button
                            onClick={() => handleRestore(backup.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition flex items-center gap-1"
                          >
                            <Upload className="size-4" />
                            שחזר
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
      </div>
    </div>
  );
}

