'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUserProfile } from '@/contexts/user-profile';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Package, Wrench, Phone, MoreHorizontal, User, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { GlobalSearch } from '@/components/common/global-search';
import { Logo } from '@/components/common/logo';
import { clearToken, getToken } from '@/lib/auth';

const NAV_PRIMARY_MARKETING = [
  { href: '/store', label: 'חנות' },
  { href: '/builder', label: 'בנה מערכת' },
  { href: '/contact', label: 'צור קשר' },
];

const NAV_MORE_MARKETING = [
  { href: '/about', label: 'מי אנחנו' },
  { href: '/solutions', label: 'פתרונות' },
  { href: '/blog', label: 'בלוג' },
  { href: '/guides', label: 'מדריכים' },
  { href: '/certifications', label: 'תעודות' },
  { href: '/trust', label: 'תקנים ואמון' },
  { href: '/hybrid', label: 'On‑Prem / Hybrid' },
  { href: '/demo-visit', label: 'ביקור מדידה' },
];

const NAV_PRIMARY_APP = [
  { href: '/panel', label: 'דשבורד' },
  { href: '/settings', label: 'הגדרות' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { status } = useSession();
  const { profile } = useUserProfile();
  const pathname = usePathname();
  const router = useRouter();
  const hasJwt = typeof window !== 'undefined' && !!getToken();
  useEffect(() => { setMounted(true); }, []);
  const isAuthed = mounted && (status === 'authenticated' || !!profile || hasJwt);
  const isAppContext = pathname?.startsWith('/saas') || pathname?.startsWith('/panel') || pathname?.startsWith('/admin');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { 
        e.preventDefault(); 
        setSearchOpen(true); 
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const Active = (href: string) =>
    pathname === href ? 'text-white' : '';

  const handleLogout = async () => {
    try {
      clearToken();
      try { await signOut({ redirect: false }); } catch {}
    } finally {
      router.push('/login');
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-700" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Left: logo */}
          <Link href="/" className="flex items-center"><Logo /></Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {(isAppContext ? NAV_PRIMARY_APP : NAV_PRIMARY_MARKETING).map(i => (
              <Link key={i.href} href={i.href} className={`transition-colors whitespace-nowrap text-white/80 hover:text-white ${Active(i.href)}`}>
                {i.label}
              </Link>
            ))}
            {!isAppContext && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white/80 hover:text-white gap-1">
                  עוד <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 text-gray-100 border border-gray-700 dropdown-menu-content">
                {NAV_MORE_MARKETING.map(i => (
                  <DropdownMenuItem key={i.href} asChild className="focus:bg-white/10 focus:text-white">
                    <Link href={i.href} className="text-white hover:text-white">{i.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>

          {/* Desktop actions: search, theme, profile/cta */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="חיפוש" onClick={() => setSearchOpen(true)} className="text-white/80 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            {!mounted ? null : isAuthed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="חשבון" className="text-white/80 hover:text-white">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 text-gray-100 border border-gray-700">
                  <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/panel">הפאנל שלי</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/settings">הגדרות</Link></DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={handleLogout} className="focus:bg-white/10 focus:text-white">התנתק</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                {isAppContext ? (
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Link href="/login">התחבר למערכת</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Link href="/login">התחבר</Link>
                    </Button>
                    <Button asChild className="cta-button">
                      <Link href="/contact">קבל הצעת מחיר</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="חיפוש" onClick={() => setSearchOpen(true)} className="text-white/80 hover:text-white">
              <Search className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="תפריט" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(v=>!v)} className="text-white/80 hover:text-white">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
            {open && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-700 bg-gray-900/95 text-white">
            <div className="px-3 py-2 space-y-1">
                  {(isAppContext ? NAV_PRIMARY_APP : [...NAV_PRIMARY_MARKETING, ...NAV_MORE_MARKETING]).map(i => (
                <Link key={i.href} href={i.href} onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-right text-white/80 hover:text-white hover:bg-white/10">
                  {i.label}
                </Link>
              ))}
              <div className="pt-2 flex gap-2">
                    {isAppContext ? (
                      <Button asChild variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10"><Link href="/login" onClick={() => setOpen(false)}>התחבר למערכת</Link></Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10"><Link href="/login" onClick={() => setOpen(false)}>התחבר</Link></Button>
                        <Button asChild className="flex-1 cta-button"><Link href="/contact" onClick={() => setOpen(false)}>קבל הצעת מחיר</Link></Button>
                      </>
                    )}
              </div>
            </div>
          </div>
        )}
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
}