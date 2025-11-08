'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Search, Filter, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface Review {
  id: number;
  product_id?: number;
  sku?: string;
  user_name: string;
  user_email?: string;
  rating: number;
  title?: string;
  review_text: string;
  images?: string[];
  verified_purchase: boolean;
  helpful_count: number;
  status: string;
  created_at: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchReviews(token);
  }, [router, statusFilter, ratingFilter]);

  const fetchReviews = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setReviews(data.reviews || []);
      } else {
        showToast(data.error || 'שגיאה בטעינת ביקורות', 'error');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      showToast('שגיאה בטעינת ביקורות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast('סטטוס ביקורת עודכן בהצלחה', 'success');
        fetchReviews(token);
      } else {
        showToast(data.error || 'שגיאה בעדכון סטטוס', 'error');
      }
    } catch (err) {
      console.error('Error updating review:', err);
      showToast('שגיאה בעדכון סטטוס', 'error');
    }
  };

  const deleteReview = async (reviewId: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הביקורת הזו?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        showToast('ביקורת נמחקה בהצלחה', 'success');
        fetchReviews(token);
      } else {
        showToast(data.error || 'שגיאה במחיקת ביקורת', 'error');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      showToast('שגיאה במחיקת ביקורת', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'spam': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (review.sku && review.sku.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Star className="size-8 text-gold" />
            ניהול ביקורות ודירוגים
          </h1>
          <p className="text-zinc-400">אישור, דחייה ומחיקה של ביקורות</p>
        </div>

        {/* Filters */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-5" />
              <input
                type="text"
                placeholder="חיפוש ביקורות..."
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
              <option value="pending">ממתין לאישור</option>
              <option value="approved">מאושר</option>
              <option value="rejected">נדחה</option>
              <option value="spam">ספאם</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="all">כל הדירוגים</option>
              <option value="5">5 כוכבים</option>
              <option value="4">4 כוכבים</option>
              <option value="3">3 כוכבים</option>
              <option value="2">2 כוכבים</option>
              <option value="1">1 כוכב</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מוצר</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">לקוח</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">דירוג</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">ביקורת</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      אין ביקורות להצגה
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{review.sku || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{review.user_name}</div>
                        {review.user_email && (
                          <div className="text-sm text-zinc-400">{review.user_email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`size-4 ${
                                star <= review.rating
                                  ? 'fill-gold text-gold'
                                  : 'text-zinc-600'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-zinc-300">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          {review.title && (
                            <div className="font-semibold text-white mb-1">{review.title}</div>
                          )}
                          <div className="text-sm text-zinc-300 line-clamp-2">
                            {review.review_text}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(review.status)}`}>
                          {review.status === 'pending' ? 'ממתין' :
                           review.status === 'approved' ? 'מאושר' :
                           review.status === 'rejected' ? 'נדחה' : 'ספאם'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-400">
                          {new Date(review.created_at).toLocaleDateString('he-IL')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {review.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateReviewStatus(review.id, 'approved')}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition flex items-center gap-1"
                              >
                                <CheckCircle className="size-4" />
                                אישר
                              </button>
                              <button
                                onClick={() => updateReviewStatus(review.id, 'rejected')}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition flex items-center gap-1"
                              >
                                <XCircle className="size-4" />
                                דחה
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition"
                          >
                            <Trash2 className="size-4" />
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

