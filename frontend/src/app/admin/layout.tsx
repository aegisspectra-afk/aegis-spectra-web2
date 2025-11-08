/**
 * Admin Layout - Unified layout for all admin pages
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  UserPlus,
  MessageSquare,
  Tag,
  Star,
  FileText,
  Download,
  Search
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
      return;
    }
    
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  // Redirect if not authenticated (handled in useEffect)
  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">מעביר לדף התחברות...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold mx-auto"></div>
        </div>
      </div>
    );
  }

const menuItems = [
  { href: '/admin', label: 'דשבורד', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'הזמנות', icon: ShoppingCart },
  { href: '/admin/leads', label: 'לידים', icon: Users },
  { href: '/admin/support', label: 'תמיכה', icon: MessageSquare },
  { href: '/admin/packages', label: 'חבילות', icon: Package },
  { href: '/admin/products', label: 'מוצרים', icon: Package },
  { href: '/admin/users', label: 'משתמשים', icon: Users },
  { href: '/admin/inventory', label: 'מלאי', icon: Package },
  { href: '/admin/coupons', label: 'קופונים', icon: Tag },
  { href: '/admin/reviews', label: 'ביקורות', icon: Star },
  { href: '/admin/blog', label: 'בלוג', icon: FileText },
  { href: '/admin/search', label: 'חיפוש מתקדם', icon: Search },
  { href: '/admin/export', label: 'ייצוא נתונים', icon: Download },
  { href: '/admin/analytics', label: 'אנליטיקה', icon: BarChart3 },
  { href: '/admin/logs', label: 'יומן פעילות', icon: Shield },
  { href: '/admin/settings', label: 'הגדרות', icon: Settings },
];

  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="size-6 text-gold" />
            <span className="font-bold text-gold">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gold hover:text-gold/80 transition"
          >
            {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static top-16 lg:top-0 left-0 bottom-0 z-40
          w-64 bg-black/30 border-r border-zinc-800
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <Shield className="size-8 text-gold" />
              <div>
                <h1 className="font-bold text-lg text-white">Admin Panel</h1>
                <p className="text-xs text-zinc-400">Aegis Spectra</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                                (item.href === '/admin' && pathname === '/admin') ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-gold/20 text-gold border-r-2 border-gold' 
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="mt-8 pt-8 border-t border-zinc-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="size-5" />
                <span>התנתק</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

