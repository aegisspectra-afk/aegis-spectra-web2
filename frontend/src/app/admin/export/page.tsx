'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileSpreadsheet, FileText, Calendar, Filter, Loader2 } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface ExportOptions {
  type: 'orders' | 'products' | 'users' | 'leads' | 'reviews';
  format: 'csv' | 'excel';
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

export default function AdminExportPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [exporting, setExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    type: 'orders',
    format: 'csv',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const params = new URLSearchParams();
      params.append('type', options.type);
      params.append('format', options.format);
      if (options.dateFrom) params.append('dateFrom', options.dateFrom);
      if (options.dateTo) params.append('dateTo', options.dateTo);
      if (options.status) params.append('status', options.status);

      const res = await fetch(`/api/admin/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${options.type}_${new Date().toISOString().split('T')[0]}.${options.format === 'csv' ? 'csv' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('ייצוא הושלם בהצלחה', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'שגיאה בייצוא', 'error');
      }
    } catch (err) {
      console.error('Error exporting:', err);
      showToast('שגיאה בייצוא', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Download className="size-8 text-gold" />
          ייצוא נתונים
        </h1>

        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">סוג נתונים *</label>
            <select
              value={options.type}
              onChange={(e) => setOptions({ ...options, type: e.target.value as ExportOptions['type'] })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="orders">הזמנות</option>
              <option value="products">מוצרים</option>
              <option value="users">משתמשים</option>
              <option value="leads">לידים</option>
              <option value="reviews">ביקורות</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">פורמט *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="csv"
                  checked={options.format === 'csv'}
                  onChange={(e) => setOptions({ ...options, format: e.target.value as 'csv' | 'excel' })}
                  className="rounded"
                />
                <FileText className="size-5 text-zinc-400" />
                <span>CSV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="excel"
                  checked={options.format === 'excel'}
                  onChange={(e) => setOptions({ ...options, format: e.target.value as 'csv' | 'excel' })}
                  className="rounded"
                />
                <FileSpreadsheet className="size-5 text-zinc-400" />
                <span>Excel</span>
              </label>
            </div>
          </div>

          {options.type === 'orders' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">מתאריך</label>
                  <input
                    type="date"
                    value={options.dateFrom || ''}
                    onChange={(e) => setOptions({ ...options, dateFrom: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">עד תאריך</label>
                  <input
                    type="date"
                    value={options.dateTo || ''}
                    onChange={(e) => setOptions({ ...options, dateTo: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">סטטוס</label>
                <select
                  value={options.status || ''}
                  onChange={(e) => setOptions({ ...options, status: e.target.value || undefined })}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                >
                  <option value="">כל הסטטוסים</option>
                  <option value="pending">ממתין</option>
                  <option value="processing">מעבד</option>
                  <option value="shipped">נשלח</option>
                  <option value="delivered">נמסר</option>
                  <option value="cancelled">בוטל</option>
                </select>
              </div>
            </>
          )}

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full px-4 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                מייצא...
              </>
            ) : (
              <>
                <Download className="size-5" />
                ייצא נתונים
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

