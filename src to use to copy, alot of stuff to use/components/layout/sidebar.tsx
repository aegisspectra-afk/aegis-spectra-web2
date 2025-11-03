'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { getUserPermissions } from '@/lib/user-permissions';
import {
  Home,
  ShoppingCart,
  Package,
  ExternalLink,
  Search,
  Users,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
  Shield,
  Bell,
  User,
  Pin,
  PinOff,
  Truck,
  CreditCard,
  Tag,
  Camera,
  Wrench,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole: string;
  subscriptionPlan: string;
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange?: (w: number) => void;
}

export function Sidebar({ userRole, subscriptionPlan, isOpen, onToggle, onWidthChange }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPinned, setIsPinned] = useState(true);

  // Handle hover effects
  useEffect(() => {
    if (isPinned) {
      setIsExpanded(true);
    } else if (isHovered) {
      setIsExpanded(true);
    } else {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 300); // Delay before closing
      return () => clearTimeout(timer);
    }
  }, [isHovered, isPinned]);

  // Report current sidebar width to layout so content padding adjusts correctly
  useEffect(() => {
    if (!onWidthChange) return;
    const compute = () => {
      const lg = window.matchMedia('(min-width: 1024px)').matches;
      const width = lg ? (isExpanded ? 256 : 64) : 0; // px
      onWidthChange(width);
    };
    compute();
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isExpanded, onWidthChange]);

  const getNavigationItems = () => {
    const permissions = getUserPermissions(userRole, subscriptionPlan);
    
    const iconMap = {
      'Panel': Home,
      'SaaS Dashboard': Home,
      'Search': Search,
      'Orders': ShoppingCart,
      'Products': Package,
      'Inventory': Package,
      'Customers': Users,
      'Shipping': Truck,
      'Cameras': Camera,
      'Security': Shield,
      'Cyber Defense': Shield,
      'Deployment': Wrench,
      'Analytics': BarChart3,
      'Reports': FileText,
      'Network Scans': Shield,
      'Users': User,
      'Settings': Settings,
      'Billing': CreditCard,
      'License Manager': Tag,
      'Downloads': Download,
      'Store': ExternalLink,
    };

    const hrefMap = {
      'Panel': '/panel',
      'SaaS Dashboard': '/saas/dashboard',
      'Search': '/panel/search',
      'Orders': '/panel/orders',
      'Products': '/panel/products',
      'Inventory': '/panel/inventory',
      'Customers': '/panel/customers',
      'Shipping': '/panel/shipping',
      'Cameras': '/panel/cameras',
      'Security': '/panel/security',
      'Cyber Defense': '/panel/cyber-defense',
      'Deployment': '/panel/deployment',
      'Analytics': '/panel/analytics',
      'Reports': '/panel/reports',
      'Network Scans': '/saas/network-scans',
      'Users': '/panel/users',
      'Settings': '/panel/settings',
      'Billing': '/panel/billing',
      'License Manager': '/panel/license-manager',
      'Downloads': '/downloads',
      'Store': '/store',
    };

    return permissions.sidebarItems.map(item => ({
      href: hrefMap[item as keyof typeof hrefMap],
      label: item,
      icon: iconMap[item as keyof typeof iconMap],
    }));
  };

  const isPanel = pathname.startsWith('/panel');
  let navigationItems = getNavigationItems();
  // Hide SaaS-specific link inside the Panel area
  if (isPanel) {
    navigationItems = navigationItems.filter((item) => item.label !== 'Network Scans');
  }

  // Grouping for /panel to look cleaner and organized
  const groupMap: Record<string, string> = {
    'Panel': 'Overview',
    'SaaS Dashboard': 'Overview',
    'Search': 'Overview',
    'Orders': 'Sales',
    'Products': 'Sales',
    'Inventory': 'Sales',
    'Shipping': 'Sales',
    'Billing': 'Sales',
    'License Manager': 'Sales',
    'Analytics': 'Insights',
    'Reports': 'Insights',
    'Customers': 'Management',
    'Users': 'Management',
    'Deployment': 'Management',
    'Cameras': 'Management',
    'Security': 'Management',
    'Cyber Defense': 'Management',
    'Downloads': 'Resources',
    'Store': 'Resources',
  };
  const groupOrder = ['Overview', 'Sales', 'Insights', 'Management', 'Resources'];
  let grouped = groupOrder
    .map((name) => ({
      name,
      items: navigationItems.filter((it) => groupMap[it.label] === name),
    }))
    .filter((g) => g.items.length > 0);

  // Fallback group for any items not mapped explicitly
  const groupedIds = new Set(grouped.flatMap((g) => g.items.map((it) => it.href)));
  const ungrouped = navigationItems.filter((it) => !groupMap[it.label] && !groupedIds.has(it.href));
  if (ungrouped.length > 0) {
    grouped = [...grouped, { name: 'Other', items: ungrouped }];
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-background border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-0",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/panel" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-aegis-teal" />
            <span className={cn(
              "text-xl font-heading font-bold transition-opacity duration-300",
              isExpanded ? "opacity-100" : "opacity-0"
            )}>
              Aegis Spectra
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden hover:bg-aegis-teal/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Pin Button - Only visible on hover or when pinned */}
        {(isHovered || isPinned) && (
          <div className="px-4 py-2 border-b border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPinned(!isPinned)}
              className="w-full justify-start hover:bg-aegis-teal/10"
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              {isPinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
              <span className={cn(
                "text-sm transition-opacity duration-300",
                isExpanded ? "opacity-100" : "opacity-0"
              )}>
                {isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
              </span>
            </Button>
          </div>
        )}


        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-4">
          {isPanel ? (
            grouped.map((group) => (
              <div key={group.name}>
                {isExpanded && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {group.name}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors group",
                          isActive
                            ? "bg-aegis-teal/12 text-aegis-teal ring-1 ring-aegis-teal/30"
                            : "text-foreground/70 hover:text-foreground hover:bg-muted"
                        )}
                        title={!isExpanded ? item.label : undefined}
                      >
                        <Icon className={cn(
                          "h-5 w-5 transition-colors duration-200 flex-shrink-0",
                          isActive ? "text-aegis-teal" : "text-foreground/60 group-hover:text-foreground"
                        )} />
                        <span className={cn(
                          "font-medium transition-opacity duration-300",
                          isExpanded ? "opacity-100" : "opacity-0"
                        )}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors group",
                    isActive
                      ? "bg-aegis-teal/12 text-aegis-teal ring-1 ring-aegis-teal/30"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                  title={!isExpanded ? item.label : undefined}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-200 flex-shrink-0",
                    isActive ? "text-aegis-teal" : "text-foreground/60 group-hover:text-foreground"
                  )} />
                  <span className={cn(
                    "font-medium transition-opacity duration-300",
                    isExpanded ? "opacity-100" : "opacity-0"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 space-y-3">
          {/* Homepage Link */}
          <Button asChild variant="ghost" size="sm" className="w-full justify-start hover:bg-aegis-teal/8" title={!isExpanded ? "Homepage" : undefined}>
            <Link href="/">
              <ExternalLink className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className={cn(
                "font-medium transition-opacity duration-300",
                isExpanded ? "opacity-100" : "opacity-0"
              )}>
                Homepage
              </span>
            </Link>
          </Button>

        </div>
      </div>
    </>
  );
}