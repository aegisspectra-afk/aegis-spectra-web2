/**
 * Admin Package Versions Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, History, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { packages } from '@/data/packages';
import { useToastContext } from '@/components/ToastProvider';

export default function AdminPackageVersionsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToastContext();
  const packageId = params.id as string;
  
  const [packageData, setPackageData] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Load package
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setPackageData(pkg);
    }

    // Load versions
    fetchVersions(token);
  }, [packageId, router]);

  const fetchVersions = async (token: string) => {
    try {
      const response = await fetch(`/api/admin/packages/${packageId}/versions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setVersions(data.data || []);
      } else {
        showToast('שגיאה בטעינת גרסאות', 'error');
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      showToast('שגיאה בטעינת גרסאות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: number) => {
    if (!confirm(`האם לחזור לגרסה ${version}?`)) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const response = await fetch(`/api/admin/packages/${packageId}/rollback/${version}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        showToast(`חוזר לגרסה ${version}`, 'success');
        router.push('/admin/packages');
      } else {
        showToast(data.error || 'שגיאה בחזרה לגרסה', 'error');
      }
    } catch (error) {
      console.error('Error rolling back:', error);
      showToast('שגיאה בחזרה לגרסה', 'error');
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
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition mb-4"
          >
            <ArrowRight className="size-4" />
            חזרה לרשימת חבילות
          </Link>
          <h1 className="text-4xl font-bold mb-2">היסטוריית גרסאות</h1>
          {packageData && (
            <p className="text-zinc-400">{packageData.nameHebrew}</p>
          )}
        </div>

        {/* Versions List */}
        {versions.length > 0 ? (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <motion.div
                key={version.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gold/20 text-gold rounded-full p-3">
                      <History className="size-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-white">גרסה {version.version}</span>
                        {index === 0 && (
                          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                            נוכחית
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">
                        {version.changesSummary || 'ללא תיאור שינויים'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(version.createdAt).toLocaleString('he-IL')}
                        {version.changedBy && ` • על ידי ${version.changedBy}`}
                      </p>
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      onClick={() => handleRollback(version.version)}
                      className="flex items-center gap-2 px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold/10 transition"
                    >
                      <RotateCcw className="size-4" />
                      חזור לגרסה זו
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-black/30 border border-zinc-800 rounded-xl">
            <History className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין גרסאות זמינות</p>
          </div>
        )}
      </div>
    </div>
  );
}

