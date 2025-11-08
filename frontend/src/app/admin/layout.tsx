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
  Search,
  Truck,
  CreditCard,
  Building2,
  Mail,
  Key,
  Repeat,
  Bell,
  Plug,
  Image as ImageIcon,
  Database,
  Gauge,
  ChevronDown,
  ChevronUp,
  Store
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

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

interface MenuItem {
  href?: string;
  label: string;
  icon: any;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { href: '/admin', label: 'דשבורד', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'הזמנות', icon: ShoppingCart },
  {
    label: 'חנות',
    icon: Store,
    children: [
      { href: '/admin/products', label: 'מוצרים', icon: Package },
      { href: '/admin/packages', label: 'חבילות', icon: Package },
      { href: '/admin/inventory', label: 'מלאי', icon: Package },
      { href: '/admin/coupons', label: 'קופונים', icon: Tag },
      { href: '/admin/reviews', label: 'ביקורות', icon: Star },
    ],
  },
  { href: '/admin/leads', label: 'לידים', icon: Users },
  { href: '/admin/users', label: 'משתמשים', icon: Users },
  { href: '/admin/blog', label: 'בלוג', icon: FileText },
  { href: '/admin/support', label: 'תמיכה', icon: MessageSquare },
  {
    label: 'מכירות ושיווק',
    icon: BarChart3,
    children: [
      { href: '/admin/crm', label: 'CRM', icon: Users },
      { href: '/admin/analytics', label: 'אנליטיקה', icon: BarChart3 },
      { href: '/admin/search', label: 'חיפוש מתקדם', icon: Search },
      { href: '/admin/export', label: 'ייצוא נתונים', icon: Download },
      { href: '/admin/seo', label: 'SEO', icon: Search },
    ],
  },
  {
    label: 'תשלומים ומשלוחים',
    icon: CreditCard,
    children: [
      { href: '/admin/payments', label: 'תשלומים', icon: CreditCard },
      { href: '/admin/shipping', label: 'משלוחים', icon: Truck },
      { href: '/admin/recurring-orders', label: 'הזמנות חוזרות', icon: Repeat },
      { href: '/admin/subscriptions', label: 'מנויים', icon: CreditCard },
    ],
  },
  {
    label: 'תקשורת',
    icon: MessageSquare,
    children: [
      { href: '/admin/email-templates', label: 'תבניות אימייל', icon: Mail },
      { href: '/admin/sms', label: 'SMS', icon: MessageSquare },
      { href: '/admin/push-notifications', label: 'Push', icon: Bell },
    ],
  },
  {
    label: 'ניהול ואבטחה',
    icon: Shield,
    children: [
      { href: '/admin/permissions', label: 'הרשאות', icon: Shield },
      { href: '/admin/security', label: 'אבטחה', icon: Shield },
      { href: '/admin/api-keys', label: 'מפתחות API', icon: Key },
      { href: '/admin/logs', label: 'יומן פעילות', icon: Shield },
    ],
  },
  {
    label: 'תשתית',
    icon: Database,
    children: [
      { href: '/admin/vendors', label: 'ספקים', icon: Building2 },
      { href: '/admin/images', label: 'תמונות', icon: ImageIcon },
      { href: '/admin/backup', label: 'גיבויים', icon: Database },
      { href: '/admin/performance', label: 'ביצועים', icon: Gauge },
      { href: '/admin/integrations', label: 'אינטגרציות', icon: Plug },
    ],
  },
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
            <nav className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isCategoryOpen = openCategories[item.label] || false;
                const isActive = item.href && (
                  pathname === item.href || 
                  (item.href === '/admin' && pathname === '/admin') ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                ) || (hasChildren && item.children?.some(child => 
                  pathname === child.href || (child.href && pathname.startsWith(child.href))
                ));
                
                if (hasChildren) {
                  return (
                    <div key={index}>
                      <button
                        onClick={() => setOpenCategories({ ...openCategories, [item.label]: !isCategoryOpen })}
                        className={`
                          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-gold/20 text-gold border-r-2 border-gold' 
                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="size-5" />
                          <span>{item.label}</span>
                        </div>
                        {isCategoryOpen ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                      {isCategoryOpen && (
                        <div className="mr-4 mt-1 space-y-1 border-r-2 border-zinc-700">
                          {item.children?.map((child, childIndex) => {
                            const ChildIcon = child.icon;
                            const isChildActive = child.href && (
                              pathname === child.href || 
                              (child.href !== '/admin' && pathname.startsWith(child.href))
                            );
                            
                            return (
                              <Link
                                key={childIndex}
                                href={child.href || '#'}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                  flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm
                                  ${isChildActive 
                                    ? 'bg-gold/10 text-gold' 
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                  }
                                `}
                              >
                                <ChildIcon className="size-4" />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={index}
                    href={item.href || '#'}
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

