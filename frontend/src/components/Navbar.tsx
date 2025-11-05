"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { trackLogout } from "@/lib/analytics";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem("user_token");
      setIsLoggedIn(!!token);
    };

    // Check immediately
    checkAuth();

    // Listen for storage changes (e.g., logout from another tab)
    window.addEventListener('storage', checkAuth);

    // Also check on pathname change (navigation)
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [pathname]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsOpen(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("user_token");
      
      // Call logout API to clear server-side session
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }).catch(() => {
          // Ignore errors - clear client-side anyway
        });
      }
      
      // Clear client-side storage
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      setIsLoggedIn(false);
      trackLogout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear client-side even if API call fails
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      setIsLoggedIn(false);
      trackLogout();
      router.push("/");
    }
  };

  // Navigation links - same as StickyNav (updated to match)
  const navLinks = [
    { href: "/services", label: "שירותים" },
    { href: "/products", label: "מוצרים" },
    { href: "/portfolio", label: "פורטפוליו" },
    { href: "/quote", label: "הצעת מחיר" },
    { href: "/about", label: "אודות" },
    { href: "/blog", label: "בלוג" },
    { href: "/contact", label: "צור קשר" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-zinc-800/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
            <Shield className="text-gold size-6 group-hover:text-gold/80 transition" />
          </motion.div>
          <span className="font-bold text-gold text-lg group-hover:text-gold/80 transition">Aegis Spectra</span>
        </Link>
        
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-gold transition relative group"
              >
                {link.label}
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/user"
                  className="flex items-center gap-2 hover:text-gold transition"
                >
                  <User className="size-4" />
                  דשבורד
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition"
                >
                  <LogOut className="size-4" />
                  התנתק
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="hover:text-gold transition"
                >
                  התחברות
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-gold px-4 py-2 hover:bg-gold hover:text-black transition relative overflow-hidden group"
                >
                  <span className="relative z-10">הרשמה</span>
                  <motion.span
                    className="absolute inset-0 bg-gold"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </div>
            )}
          </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gold hover:text-gold/80 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="תפריט"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-80 bg-charcoal border-l border-zinc-800 z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-lg hover:text-gold transition border-b border-zinc-800"
                  >
                    {link.label}
                  </Link>
                ))}
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/user"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 block py-3 text-lg hover:text-gold transition border-b border-zinc-800"
                    >
                      <User className="size-5" />
                      דשבורד
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-right py-3 text-lg text-red-400 hover:text-red-300 transition border-b border-zinc-800"
                    >
                      <LogOut className="size-5" />
                      התנתק
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block mt-6 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 text-center font-semibold hover:bg-zinc-800 transition"
                    >
                      התחברות
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-xl bg-gold text-black px-6 py-3 text-center font-semibold hover:bg-gold/90 transition"
                    >
                      הרשמה
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

