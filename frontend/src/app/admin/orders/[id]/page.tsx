/**
 * Admin Order Details Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Package, User, MapPin, Phone, Mail, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import { useToastContext } from '@/components/ToastProvider';

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  items: Array<{
    sku: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  shipping_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToastContext();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchOrder(token);
  }, [orderId, router]);

  const fetchOrder = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.ok) {
        setOrder(data.order);
      } else {
        showToast(data.error || 'שגיאה בטעינת הזמנה', 'error');
        router.push('/admin/orders');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      showToast('שגיאה בטעינת הזמנה', 'error');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const res = await fetch(`/api/admin/orders/${orderId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${orderId}.pdf`;
        link.click();
        showToast('חשבונית הורדה בהצלחה', 'success');
      } else {
        showToast('שגיאה בהורדת חשבונית', 'error');
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
      showToast('שגיאה בהורדת חשבונית', 'error');
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

  if (!order) {
    return null;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition mb-4"
          >
            <ArrowRight className="size-4" />
            חזרה לרשימת הזמנות
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">פרטי הזמנה</h1>
              <p className="text-zinc-400">מספר הזמנה: {order.order_id}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition"
              >
                <Download className="size-5" />
                הורד חשבונית
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border-2 border-zinc-700 rounded-lg font-semibold hover:bg-zinc-800 transition"
              >
                <Printer className="size-5" />
                הדפס
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package className="size-6 text-gold" />
                פריטי הזמנה
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-zinc-800 last:border-0">
                    <div>
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-sm text-zinc-400">SKU: {item.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{item.quantity} × {item.price.toLocaleString()} ₪</div>
                      <div className="text-gold font-bold">{(item.quantity * item.price).toLocaleString()} ₪</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">הערות</h2>
                <p className="text-zinc-300">{order.notes}</p>
              </div>
            )}
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
                  <span className="text-white">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-zinc-400" />
                  <span className="text-zinc-300">{order.customer_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-zinc-400" />
                  <span className="text-zinc-300">{order.customer_phone}</span>
                </div>
                {order.customer_address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-zinc-400" />
                    <span className="text-zinc-300">{order.customer_address}, {order.customer_city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">סיכום הזמנה</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-zinc-300">
                  <span>סה&quot;כ פריטים:</span>
                  <span>{order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>סה&quot;כ ביניים:</span>
                  <span>{order.subtotal.toLocaleString()} ₪</span>
                </div>
                {order.shipping > 0 && (
                  <div className="flex justify-between text-zinc-300">
                    <span>משלוח:</span>
                    <span>{order.shipping.toLocaleString()} ₪</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>הנחה:</span>
                    <span>-{order.discount.toLocaleString()} ₪</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold text-gold pt-3 border-t border-zinc-800">
                  <span>סה&quot;כ:</span>
                  <span>{order.total.toLocaleString()} ₪</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">סטטוס</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">סטטוס הזמנה</div>
                  <div className={`px-3 py-2 rounded-lg text-sm font-semibold inline-block ${
                    order.order_status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                    order.order_status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.order_status === 'pending' ? 'ממתין' :
                     order.order_status === 'processing' ? 'בעיבוד' :
                     order.order_status === 'shipped' ? 'נשלח' :
                     order.order_status === 'delivered' ? 'נמסר' : 'בוטל'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">סטטוס תשלום</div>
                  <div className={`px-3 py-2 rounded-lg text-sm font-semibold inline-block ${
                    order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.payment_status === 'paid' ? 'שולם' : 'ממתין'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">שיטת תשלום</div>
                  <div className="text-white">{order.payment_method}</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">שיטת משלוח</div>
                  <div className="text-white">{order.shipping_method}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

