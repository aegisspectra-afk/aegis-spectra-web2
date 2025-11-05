"use client";

import { Shield, Phone, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-12 sm:mt-16 md:mt-20 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-gold size-8" />
              <span className="font-bold text-gold text-xl">Aegis Spectra Security</span>
            </div>
            <p className="max-w-md text-zinc-400 text-sm leading-relaxed mb-2">
              אבטחה חכמה לבית ולעסק — מצלמות, בקרת כניסה וניהול מרחוק. 
              שירותי התקנה מקצועיים ותמיכה מקוונת.
            </p>
            <p className="max-w-md text-zinc-500 text-xs leading-relaxed mb-4">
              <Link href="/legal-disclaimer" className="hover:text-gold transition underline">
                Aegis Spectra הינה עסק עצמאי ואינה נציג רשמי של מותגים
              </Link>
            </p>
            
            {/* Newsletter Signup */}
            <NewsletterSignup />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "דף הבית" },
                { href: "/services", label: "שירותים" },
                { href: "/products", label: "מוצרים" },
                { href: "/portfolio", label: "פורטפוליו" },
                { href: "/quote", label: "הצעת מחיר" },
                { href: "/about", label: "אודות" },
                { href: "/blog", label: "בלוג" },
                { href: "/contact", label: "צור קשר" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-400 hover:text-gold transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">מידע משפטי</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/privacy", label: "מדיניות פרטיות" },
                { href: "/terms", label: "תנאי שירות" },
                { href: "/legal-disclaimer", label: "הצהרת אחריות" },
                { href: "https://wa.me/972559737025", label: "WhatsApp" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-gold transition"
                    {...(link.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} Aegis Spectra Security — כל הזכויות שמורות
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <a href="tel:+972559737025" className="hover:text-gold transition flex items-center gap-2">
                <Phone className="size-4 text-gold" />
                <span>055-973-7025</span>
              </a>
              <a href="mailto:aegisspectra@gmail.com" className="hover:text-gold transition flex items-center gap-2">
                <Mail className="size-4 text-gold" />
                <span>aegisspectra@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

