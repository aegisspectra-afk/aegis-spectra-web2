'use client';

import { Button } from '@/components/ui/button';
import { Bell, User, LogOut, Settings, Menu, Home, Shield, FileText, CreditCard, Download, Link as LinkIcon, Scan, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { getUserPermissions } from '@/lib/user-permissions';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
// import { apiCreateSchedule } from '@/lib/api';

interface TopBarProps {
  onMenuClick: () => void;
  userRole: string;
  subscriptionPlan: string;
  showNav?: boolean;
}

export function TopBar({ onMenuClick, userRole, subscriptionPlan, showNav = false }: TopBarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [notifCount, setNotifCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const [searchText, setSearchText] = useState('');
  const permissions = getUserPermissions(userRole, subscriptionPlan);
  const hrefMap: Record<string,string> = {
    'SaaS Dashboard': '/saas/dashboard',
    'Network Scans': '/saas/network-scans',
    'Reports': '/panel/reports',
    'Settings': '/panel/settings',
    'Billing': '/panel/billing',
    'Downloads': '/downloads',
  };
  const iconMap: Record<string, any> = {
    'SaaS Dashboard': Home,
    'Network Scans': Shield,
    'Reports': FileText,
    'Settings': Settings,
    'Billing': CreditCard,
    'Downloads': Download,
  };
  const navItems = permissions.sidebarItems
    .filter((label) => Object.keys(hrefMap).includes(label))
    .map((label) => ({ label, href: hrefMap[label], Icon: iconMap[label] }));
  // Ensure SaaS Dashboard is available in SaaS header even if permissions missed it
  if (showNav && !navItems.some(i => i.label === 'SaaS Dashboard')) {
    navItems.unshift({ label: 'SaaS Dashboard', href: '/saas/dashboard', Icon: Home });
  }
  const renderedNavItems = showNav ? navItems.filter((i) => i.label !== 'Downloads') : navItems;
  const isDownloads = pathname.startsWith('/downloads');

  // SaaS header extras: websocket status + notifications
  useEffect(() => {
    if (!showNav) return;
    try {
      const baseHttp = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const base = baseHttp.replace('http', 'ws');
      const token = (document.cookie.match(/(?:^|; )spectra_token=([^;]+)/) || [])[1];
      const qs = token ? `?token=${encodeURIComponent(decodeURIComponent(token))}` : '';
      const ws = new WebSocket(`${base}/api/ws/scan-events${qs}`);
      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg?.type === 'scan_created' || msg?.type === 'scan_completed') {
            setNotifCount((c) => Math.min(99, c + 1));
          }
        } catch {}
      };
      return () => ws.close();
    } catch {
      // ignore
    }
  }, [showNav]);

  const apiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000', []);

  const handleCopyApiUrl = async () => {
    try {
      await navigator.clipboard.writeText(apiBaseUrl);
      toast.success('BASE_URL copied');
    } catch (e: any) {
      toast.error('Copy failed', { description: e?.message || '' });
    }
  };

  const handleCopyJwt = async () => {
    try {
      const token = (document.cookie.match(/(?:^|; )spectra_token=([^;]+)/) || [])[1];
      if (!token) return toast.error('No JWT cookie found');
      await navigator.clipboard.writeText(decodeURIComponent(token));
      toast.success('JWT copied');
    } catch (e: any) {
      toast.error('Copy failed', { description: e?.message || '' });
    }
  };

  const handleSearch = () => {
    const q = searchText.trim();
    if (!q) return;
    router.push(`/saas/network-scans?search=${encodeURIComponent(q)}`);
  };

  const handleCreateSchedule = async () => {
    router.push('/panel/reports');
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch {}
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Brand */}
        <Link href="/panel" className="text-sm font-semibold mr-4">Aegis Spectra</Link>

        {/* Inline Navigation */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-1">
            {renderedNavItems.map(({ href, label, Icon }) => {
              const isActive = label === 'SaaS Dashboard'
                ? pathname.startsWith('/saas/dashboard')
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${
                    isActive
                      ? 'border-aegis-teal/30 bg-aegis-teal/10 text-foreground'
                      : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {Icon ? <Icon className={`h-4 w-4 ${isActive ? 'text-aegis-teal' : 'text-foreground/60'}`} /> : null}
                  <span>{label}</span>
                </Link>
              );
            })}
            {/* Search */}
            <div className="ml-2 hidden lg:flex items-center">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search scans..."
                className="h-9 w-48 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-aegis-teal/30"
              />
            </div>
            {/* New Scan */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="ml-2" variant="outline">
                  <Scan className="h-4 w-4 mr-2" /> New Scan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/saas/network-scans">Network Scan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saas/network-scans#upload">Upload File</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Download CLI */}
            <Link href="/downloads" className="ml-2" aria-current={isDownloads ? 'page' : undefined}>
              <Button size="sm" variant="outline" className={isDownloads ? 'border-aegis-teal/30 bg-aegis-teal/10 text-foreground' : undefined}>
                <Download className="h-4 w-4 mr-2" /> Download CLI
              </Button>
            </Link>
          </nav>
        )}

        {/* Mobile Navigation */}
        {showNav && (
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {renderedNavItems.map(({ href, label, Icon }) => (
                  <DropdownMenuItem asChild key={href}>
                    <Link href={href} className="flex items-center">
                      {Icon ? <Icon className="h-4 w-4 mr-2" /> : null}
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/saas/network-scans" className="flex items-center">
                    <Scan className="h-4 w-4 mr-2" /> New Scan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/downloads" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" /> Download CLI
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* WS Status */}
          {showNav && (
            <div title={wsConnected ? 'WebSocket connected' : 'WebSocket disconnected'} className={`h-2.5 w-2.5 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          )}

          {/* Copy */}
          {showNav && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-aegis-blue/10">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={handleCopyApiUrl}>Copy BASE_URL</DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyJwt}>Copy JWT</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-aegis-blue/10" onClick={() => setNotifCount(0)}>
            <Bell className="h-4 w-4" />
            {showNav && notifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-h-4 min-w-4 px-1 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            )}
          </Button>

          {/* Quick Actions */}
          {showNav && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-aegis-blue/10">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleCreateSchedule}>Create Schedule</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/panel/reports">View Schedules</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Theme */}
          {showNav && (
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="hover:bg-aegis-blue/10" title="Toggle theme">
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 block dark:hidden" />
            </Button>
          )}

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-aegis-blue/10">
                <div className="h-8 w-8 rounded-full bg-aegis-blue/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-aegis-blue" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-aegis-blue/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-aegis-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session?.user?.email}
                    </p>
                    <div className="flex gap-1 mt-1">
                      <span className="text-xs bg-aegis-blue/10 text-aegis-blue px-2 py-1 rounded-full font-medium">
                        {userRole}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {subscriptionPlan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <DropdownMenuItem asChild>
                  <Link href="/panel/settings" className="flex items-center px-4 py-2 text-sm hover:bg-aegis-blue/5">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/panel/billing" className="flex items-center px-4 py-2 text-sm hover:bg-aegis-blue/5">
                    <User className="mr-3 h-4 w-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              {/* Logout */}
              <div className="border-t border-border/50 py-1">
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}