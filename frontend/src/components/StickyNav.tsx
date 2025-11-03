"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import Link from "next/link";

export function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-zinc-800/50 shadow-lg"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="text-gold" />
              <span className="font-bold text-gold">Aegis Spectra</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#products" className="hover:text-gold transition">מוצרים</a>
              <a href="#packages" className="hover:text-gold transition">חבילות</a>
              <a href="#process" className="hover:text-gold transition">תהליך</a>
              <a href="#faq" className="hover:text-gold transition">שאלות נפוצות</a>
              <a href="#contact" className="rounded-full border border-gold px-4 py-2 hover:bg-gold hover:text-black transition">
                הזמנת ייעוץ חינם
              </a>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

