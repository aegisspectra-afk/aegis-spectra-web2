'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  BarChart3, 
  Settings, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Home,
  Shield,
  FileText,
  Users,
  ExternalLink,
  Search
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface DashboardNavbarProps {
  userRole: string;
  subscriptionPlan: string;
}

export function DashboardNavbar({ userRole, subscriptionPlan }: DashboardNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const getNavigationItems = () => {
    const baseItems = [
      { href: '/panel', label: 'Panel', icon: Home },
      { href: '/panel/cameras', label: 'Cameras', icon: Camera },
      { href: '/contact', label: 'Contact', icon: ExternalLink },
      { href: '/panel/search', label: 'Search', icon: Search },
    ];

    // Add role-specific items
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      baseItems.push(
        { href: '/panel/users', label: 'Users', icon: Users },
        { href: '/panel/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/panel/reports', label: 'Reports', icon: FileText }
      );
    }

    if (userRole === 'SUPER_ADMIN') {
      baseItems.push(
        { href: '/panel/system', label: 'System', icon: Settings }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-background border-b border-border">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/panel" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-aegis-blue" />
            <span className="text-xl font-heading font-bold">
              Aegis Spectra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Homepage Link */}
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Homepage</span>
              </Link>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-aegis-blue/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-aegis-blue" />
                  </div>
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">Welcome back!</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userRole} • {subscriptionPlan}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/panel/profile">
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/panel/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/panel/notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/panel/billing">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Billing & Usage
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/pricing">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
              
              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-border">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium">Welcome back!</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userRole} • {subscriptionPlan}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}