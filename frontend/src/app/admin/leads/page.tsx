/**
 * Admin Leads Management Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Filter, Eye, Phone, Mail, MapPin, Star, Tag } from 'lucide-react';
import Link from 'next/link';
import { useToastContext } from '@/components/ToastProvider';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  product_sku?: string;
  status: string;
  score: number;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchLeads(token);
  }, [router, statusFilter, scoreFilter]);

  const fetchLeads = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (scoreFilter !== 'all') {
        params.append('min_score', scoreFilter);
      }

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setLeads(data.leads || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת לידים', 'error');
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      showToast('שגיאה בטעינת לידים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      
      if (data.ok) {
        showToast('סטטוס עודכן בהצלחה', 'success');
        fetchLeads(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון סטטוס', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('שגיאה בעדכון סטטוס', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400',
      contacted: 'bg-yellow-500/20 text-yellow-400',
      qualified: 'bg-green-500/20 text-green-400',
      converted: 'bg-purple-500/20 text-purple-400',
      lost: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-zinc-500/20 text-zinc-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold mb-2">ניהול לידים</h1>
          <p className="text-zinc-400">ניהול כל הלידים במערכת</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
            <input
              type="text"
              placeholder="חפש ליד..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-zinc-700 rounded-xl px-12 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  statusFilter === status
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {status === 'all' ? 'הכל' : 
                 status === 'new' ? 'חדש' :
                 status === 'contacted' ? 'נוצר קשר' :
                 status === 'qualified' ? 'מוכשר' :
                 status === 'converted' ? 'הומר' : 'אבוד'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="text-zinc-400 text-sm">ניקוד מינימלי:</span>
            {['all', '40', '60', '80'].map((score) => (
              <button
                key={score}
                onClick={() => setScoreFilter(score)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  scoreFilter === score
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {score === 'all' ? 'הכל' : `${score}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        {filteredLeads.length > 0 ? (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">שם</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פרטי קשר</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מיקום</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">ניקוד</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-900/30 transition">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{lead.name}</div>
                        {lead.product_sku && (
                          <div className="text-sm text-zinc-400">מוצר: {lead.product_sku}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-4 text-zinc-400" />
                            <span className="text-zinc-300">{lead.phone}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="size-4 text-zinc-400" />
                              <span className="text-zinc-300">{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.city && (
                          <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <MapPin className="size-4 text-zinc-400" />
                            {lead.city}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 font-bold ${getScoreColor(lead.score || 0)}`}>
                          <Star className="size-4 fill-current" />
                          {lead.score || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold border-0 ${getStatusColor(lead.status)}`}
                        >
                          <option value="new">חדש</option>
                          <option value="contacted">נוצר קשר</option>
                          <option value="qualified">מוכשר</option>
                          <option value="converted">הומר</option>
                          <option value="lost">אבוד</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-zinc-300 text-sm">
                        {new Date(lead.created_at).toLocaleString('he-IL')}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="p-2 text-zinc-400 hover:text-gold transition"
                          title="צפה בפרטים"
                        >
                          <Eye className="size-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-black/30 border border-zinc-800 rounded-xl">
            <Users className="size-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">אין לידים</p>
          </div>
        )}
      </div>
    </div>
  );
}

