"use client";

import { Shield, Phone, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-20 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-gold size-8" />
              <span className="font-bold text-gold text-xl">Aegis Spectra Security</span>
            </div>
            <p className="max-w-md text-zinc-400 text-sm leading-relaxed">
              אבטחה חכמה לבית ולעסק — מצלמות, בקרת כניסה וניהול מרחוק. 
              שירותי התקנה מקצועיים ותמיכה מקוונת.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "דף הבית" },
                { href: "/services", label: "שירותים" },
                { href: "/products", label: "מוצרים" },
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
                { href: "https://wa.me/972559737025", label: "WhatsApp" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-gold transition"
                    {...(link.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {link.label}
                  </a>
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

