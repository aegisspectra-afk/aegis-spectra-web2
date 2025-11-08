'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, MessageSquare, User, Mail, Calendar, Tag, AlertCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useToastContext } from '@/components/ToastProvider';

interface TicketMessage {
  id: number;
  sender_type: string;
  sender_name: string;
  sender_email?: string;
  message: string;
  attachments?: any;
  is_internal: boolean;
  created_at: string;
}

interface SupportTicket {
  id: number;
  ticket_number: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  assigned_to?: string;
  order_id?: number;
  product_id?: number;
  messages: TicketMessage[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export default function AdminTicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToastContext();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTicket(token);
  }, [ticketId, router]);

  const fetchTicket = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setTicket(data.ticket);
      } else {
        showToast(data.error || 'שגיאה בטעינת כרטיס', 'error');
        router.push('/admin/support');
      }
    } catch (err) {
      console.error('Error fetching ticket:', err);
      showToast('שגיאה בטעינת כרטיס', 'error');
      router.push('/admin/support');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: newMessage,
          sender_type: 'admin',
          is_internal: isInternal,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('הודעה נשלחה בהצלחה', 'success');
        setNewMessage('');
        setIsInternal(false);
        fetchTicket(token);
      } else {
        showToast(data.error || 'שגיאה בשליחת הודעה', 'error');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      showToast('שגיאה בשליחת הודעה', 'error');
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/admin/support/tickets/${ticketId}`, {
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
        fetchTicket(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון סטטוס', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('שגיאה בעדכון סטטוס', 'error');
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

  if (!ticket) {
    return null;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/support"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition mb-4"
          >
            <ArrowRight className="size-4" />
            חזרה לכרטיסי תמיכה
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{ticket.subject}</h1>
              <p className="text-zinc-400">מספר כרטיס: {ticket.ticket_number}</p>
            </div>
            <div className="flex gap-3">
              <select
                value={ticket.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="open">פתוח</option>
                <option value="in_progress">בעיבוד</option>
                <option value="waiting_customer">ממתין ללקוח</option>
                <option value="resolved">נפתר</option>
                <option value="closed">סגור</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Message */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">הודעה מקורית</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 whitespace-pre-wrap">{ticket.message}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">הודעות</h2>
              <div className="space-y-4">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg ${
                        msg.sender_type === 'admin'
                          ? 'bg-gold/10 border border-gold/30'
                          : msg.is_internal
                          ? 'bg-blue-500/10 border border-blue-500/30'
                          : 'bg-zinc-900 border border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{msg.sender_name}</span>
                          {msg.is_internal && (
                            <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                              פנימי
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-zinc-400">
                          {new Date(msg.created_at).toLocaleString('he-IL')}
                        </span>
                      </div>
                      <p className="text-zinc-300 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 text-center py-8">אין הודעות</p>
                )}
              </div>
            </div>

            {/* Reply */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">שלח תשובה</h2>
              <div className="space-y-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="כתוב תשובה..."
                  rows={6}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-gold resize-none"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <span>הודעה פנימית (רק למנהלים)</span>
                  </label>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="ml-auto px-6 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="size-5" />
                    שלח
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <User className="size-6 text-gold" />
                פרטי לקוח
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="size-5 text-zinc-400" />
                  <span className="text-white">{ticket.user_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-zinc-400" />
                  <span className="text-zinc-300">{ticket.user_email}</span>
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">פרטי כרטיס</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">קטגוריה</div>
                  <div className="text-white">{ticket.category || 'כללי'}</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">עדיפות</div>
                  <div className="text-white">
                    {ticket.priority === 'urgent' ? 'דחוף' :
                     ticket.priority === 'high' ? 'גבוהה' :
                     ticket.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">סטטוס</div>
                  <div className="text-white">
                    {ticket.status === 'open' ? 'פתוח' :
                     ticket.status === 'in_progress' ? 'בעיבוד' :
                     ticket.status === 'waiting_customer' ? 'ממתין ללקוח' :
                     ticket.status === 'resolved' ? 'נפתר' : 'סגור'}
                  </div>
                </div>
                {ticket.assigned_to && (
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">מוקצה ל</div>
                    <div className="text-white">{ticket.assigned_to}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-zinc-400 mb-1">תאריך יצירה</div>
                  <div className="text-white">
                    {new Date(ticket.created_at).toLocaleString('he-IL')}
                  </div>
                </div>
                {ticket.resolved_at && (
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">תאריך פתרון</div>
                    <div className="text-white">
                      {new Date(ticket.resolved_at).toLocaleString('he-IL')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

