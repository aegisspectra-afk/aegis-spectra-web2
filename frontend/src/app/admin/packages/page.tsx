/**
 * Admin Packages Page - List and manage packages
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { packages } from '@/data/packages';
import { Package } from '@/types/packages';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useToastContext } from '@/components/ToastProvider';

export default function AdminPackagesPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Residential' | 'Commercial' | 'Enterprise'>('all');
  const [packagesList, setPackagesList] = useState<Package[]>(packages);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    // TODO: Verify token is valid
    setIsAuthenticated(true);
  }, [router]);

  const filteredPackages = packagesList.filter((pkg) => {
    const matchesSearch =
      pkg.nameHebrew.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || pkg.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-zinc-400">בודק הרשאות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">ניהול חבילות</h1>
              <button
                onClick={() => {
                  showToast('יצירת חבילה חדשה - תכונה בקרוב', 'info');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
              >
                <Plus className="size-5" />
                חבילה חדשה
              </button>
            </div>
            <p className="text-zinc-400">ניהול כל החבילות במערכת</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
              <input
                type="text"
                placeholder="חפש חבילה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-zinc-700 rounded-xl px-12 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold/70 transition"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all' as const, label: 'הכל' },
                { id: 'Residential' as const, label: 'מגזר פרטי' },
                { id: 'Commercial' as const, label: 'מגזר עסקי' },
                { id: 'Enterprise' as const, label: 'מגזר ארגוני' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    categoryFilter === cat.id
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Table */}
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">קטגוריה</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מחיר בסיס</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredPackages.map((pkg, i) => (
                    <motion.tr
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-zinc-900/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-white">{pkg.nameHebrew}</div>
                          <div className="text-sm text-zinc-400">{pkg.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{pkg.category}</td>
                      <td className="px-6 py-4 text-gold font-semibold">
                        {pkg.pricing.base.toLocaleString()} ₪
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {pkg.popular && (
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                              פופולרי
                            </span>
                          )}
                          {pkg.recommended && (
                            <span className="px-2 py-1 text-xs bg-gold/20 text-gold rounded">
                              מומלץ
                            </span>
                          )}
                          {(pkg as any).version && (
                            <span className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded">
                              v{(pkg as any).version}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/packages/${pkg.id}`}
                            className="p-2 text-zinc-400 hover:text-gold transition"
                            title="ערוך חבילה"
                          >
                            <Edit className="size-5" />
                          </Link>
                          <button
                            onClick={async () => {
                              if (confirm(`האם למחוק את ${pkg.nameHebrew}?`)) {
                                try {
                                  const token = localStorage.getItem('admin_token');
                                  if (!token) {
                                    alert('אין הרשאה');
                                    return;
                                  }

                                  const response = await fetch(`/api/admin/packages/${pkg.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                    },
                                  });

                                  const data = await response.json();
                                  
                                  if (data.success) {
                                    // Remove from local list
                                    setPackagesList(prev => prev.filter(p => p.id !== pkg.id));
                                    showToast('חבילה נמחקה בהצלחה', 'success');
                                  } else {
                                    showToast(data.error || 'שגיאה במחיקת חבילה', 'error');
                                  }
                                } catch (error) {
                                  console.error('Error deleting package:', error);
                                  showToast('שגיאה במחיקת חבילה', 'error');
                                }
                              }
                            }}
                            className="p-2 text-zinc-400 hover:text-red-400 transition"
                          >
                            <Trash2 className="size-5" />
                          </button>
                          <Link
                            href={`/admin/packages/${pkg.id}/versions`}
                            className="px-3 py-1 text-xs border border-zinc-700 rounded hover:border-gold transition"
                            title="צפה בהיסטוריית גרסאות"
                          >
                            גרסאות
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-12 text-zinc-400">
              לא נמצאו חבילות
            </div>
          )}
        </div>
    </div>
  );
}

