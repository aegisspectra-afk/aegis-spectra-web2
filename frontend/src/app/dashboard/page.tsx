'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, ShoppingBag, Settings } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface UserData {
  name: string;
  email: string;
  phone?: string;
}

interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  zip: string;
  is_default: boolean;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('overview');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const [userRes, addressesRes, wishlistRes, ordersRes] = await Promise.all([
        fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/user/addresses', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/user/wishlist', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/user/orders', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const userData = await userRes.json();
      const addressesData = await addressesRes.json();
      const wishlistData = await wishlistRes.json();
      const ordersData = await ordersRes.json();

      if (userData.ok) setUserData(userData.user);
      if (addressesData.ok) setAddresses(addressesData.addresses || []);
      if (wishlistData.ok) setWishlist(wishlistData.items || []);
      if (ordersData.ok) setOrders(ordersData.orders || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
      showToast('שגיאה בטעינת נתונים', 'error');
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <User className="size-8 text-gold" />
            לוח בקרה אישי
          </h1>
          <p className="text-zinc-400">ניהול חשבון, הזמנות וכתובות</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800">
          {[
            { id: 'overview', label: 'סקירה', icon: User },
            { id: 'orders', label: 'הזמנות', icon: ShoppingBag },
            { id: 'wishlist', label: 'רשימת משאלות', icon: Heart },
            { id: 'addresses', label: 'כתובות', icon: MapPin },
            { id: 'settings', label: 'הגדרות', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <tab.icon className="size-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">פרטים אישיים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">שם</p>
                  <p className="text-white font-semibold">{userData?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-1">אימייל</p>
                  <p className="text-white font-semibold">{userData?.email || '-'}</p>
                </div>
                {userData?.phone && (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">טלפון</p>
                    <p className="text-white font-semibold">{userData.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag className="size-8 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{orders.length}</span>
                </div>
                <p className="text-zinc-400 text-sm">הזמנות</p>
              </div>
              <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="size-8 text-red-400" />
                  <span className="text-2xl font-bold text-white">{wishlist.length}</span>
                </div>
                <p className="text-zinc-400 text-sm">פריטים ברשימת משאלות</p>
              </div>
              <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="size-8 text-green-400" />
                  <span className="text-2xl font-bold text-white">{addresses.length}</span>
                </div>
                <p className="text-zinc-400 text-sm">כתובות שמורות</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">מספר הזמנה</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">תאריך</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סכום</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">סטטוס</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                        אין הזמנות להצגה
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <a
                            href={`/order/${order.order_id}`}
                            className="text-gold hover:text-gold/80 transition"
                          >
                            {order.order_id}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-zinc-300">
                            {new Date(order.created_at).toLocaleDateString('he-IL')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">
                            {order.total.toLocaleString('he-IL')} ₪
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-sm bg-blue-500/20 text-blue-400">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`/order/${order.order_id}`}
                            className="text-gold hover:text-gold/80 transition text-sm"
                          >
                            צפה
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="size-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">רשימת המשאלות שלך ריקה</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-zinc-900 rounded-lg p-4">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                    <p className="text-gold font-bold mb-4">{item.price.toLocaleString('he-IL')} ₪</p>
                    <button className="w-full px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition">
                      הוסף לעגלה
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <div className="mb-4 flex justify-end">
              <button className="px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition">
                הוסף כתובת
              </button>
            </div>
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="size-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">אין כתובות שמורות</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-zinc-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{address.label}</h3>
                      {address.is_default && (
                        <span className="px-2 py-1 bg-gold text-black rounded text-xs font-semibold">
                          ברירת מחדל
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300">{address.street}</p>
                    <p className="text-zinc-300">{address.city}, {address.zip}</p>
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1 bg-gold text-black rounded text-sm font-semibold hover:bg-gold/90 transition">
                        ערוך
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition">
                        מחק
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">הגדרות חשבון</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">שם</label>
                <input
                  type="text"
                  defaultValue={userData?.name || ''}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">אימייל</label>
                <input
                  type="email"
                  defaultValue={userData?.email || ''}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">טלפון</label>
                <input
                  type="tel"
                  defaultValue={userData?.phone || ''}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                />
              </div>
              <button className="px-4 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition">
                שמור שינויים
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

