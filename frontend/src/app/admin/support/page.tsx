'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface SupportTicket {
  id: number;
  ticket_number: string;
  user_name: string;
  user_email: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assigned_to?: string;
  message_count: number;
  last_message_at?: string;
  created_at: string;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTickets(token);
  }, [router, statusFilter, priorityFilter, categoryFilter]);

  const fetchTickets = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const res = await fetch(`/api/support/tickets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setTickets(data.tickets || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת כרטיסים', 'error');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      showToast('שגיאה בטעינת כרטיסים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('סטטוס עודכן בהצלחה', 'success');
        fetchTickets(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון סטטוס', 'error');
      }
    } catch (err) {
      console.error('Error updating ticket:', err);
      showToast('שגיאה בעדכון סטטוס', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="size-8 text-gold" />
            ניהול תמיכה טכנית
          </h1>
          <p className="text-zinc-400">ניהול כרטיסי תמיכה ופניות לקוחות</p>
        </div>

        {/* Filters */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-5" />
              <input
                type="text"
                placeholder="חיפוש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-gold"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="open">פתוח</option>
              <option value="in_progress">בעיבוד</option>
              <option value="waiting_customer">ממתין ללקוח</option>
              <option value="resolved">נפתר</option>
              <option value="closed">סגור</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">כל העדיפויות</option>
              <option value="urgent">דחוף</option>
              <option value="high">גבוהה</option>
              <option value="medium">בינונית</option>
              <option value="low">נמוכה</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">כל הקטגוריות</option>
              <option value="technical">טכני</option>
              <option value="billing">חיוב</option>
              <option value="order">הזמנה</option>
              <option value="product">מוצר</option>
              <option value="general">כללי</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מספר כרטיס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">נושא</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">לקוח</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">קטגוריה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">עדיפות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">הודעות</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-zinc-400">
                      אין כרטיסים להצגה
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-gold">{ticket.ticket_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{ticket.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{ticket.user_name}</div>
                        <div className="text-sm text-zinc-400">{ticket.user_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-sm bg-zinc-700 text-zinc-300">
                          {ticket.category || 'כללי'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority === 'urgent' ? 'דחוף' :
                           ticket.priority === 'high' ? 'גבוהה' :
                           ticket.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'open' ? 'פתוח' :
                           ticket.status === 'in_progress' ? 'בעיבוד' :
                           ticket.status === 'waiting_customer' ? 'ממתין ללקוח' :
                           ticket.status === 'resolved' ? 'נפתר' : 'סגור'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{ticket.message_count || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {new Date(ticket.created_at).toLocaleDateString('he-IL')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/admin/support/${ticket.id}`)}
                            className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition"
                          >
                            צפה
                          </button>
                          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition"
                            >
                              סמן כפתור
                            </button>
                          )}
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

