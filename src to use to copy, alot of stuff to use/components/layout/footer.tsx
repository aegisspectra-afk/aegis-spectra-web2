import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import { Phone, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-max">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="max-w-md" style={{color: '#A0A0A0'}}>
              אבטחה חכמה לבית ולעסק — מצלמות, בקרת כניסה וניהול מרחוק. 
              שירותי התקנה מקצועיים ותמיכה מקוונת.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{color: '#F5F5F5'}}>קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="transition-colors" style={{color: '#8B8B8B'}}>
                  דף הבית
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors" style={{color: '#8B8B8B'}}>
                  מי אנחנו
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="transition-colors" style={{color: '#8B8B8B'}}>
                  פתרונות
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="transition-colors" style={{color: '#8B8B8B'}}>
                  תעודות
                </Link>
              </li>
              <li>
                <Link href="/store" className="transition-colors" style={{color: '#8B8B8B'}}>
                  חנות מוצרים
                </Link>
              </li>
              <li>
                <Link href="/builder" className="transition-colors" style={{color: '#8B8B8B'}}>
                  בונה חבילות
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors" style={{color: '#8B8B8B'}}>
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-aegis-heading mb-4">מידע משפטי</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-aegis-footer hover:text-aegis-blue transition-colors">
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-aegis-footer hover:text-aegis-blue transition-colors">
                  תנאי שירות
                </Link>
              </li>
              <li>
                <Link href="/legal-disclaimer" className="text-aegis-footer hover:text-aegis-blue transition-colors">
                  הצהרת אחריות ושימוש
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/972559737025" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-aegis-footer hover:text-aegis-blue transition-colors flex items-center space-x-2"
                  aria-label="צור קשר ב-WhatsApp (נפתח בחלון חדש)"
                >
                  <Phone className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="py-6 bg-aegis-blue/5 border-t border-border">
          <div className="text-center">
            <p className="text-aegis-text font-semibold mb-2">
              שירות באזור גוש דן והשפלה | 09:00–18:00 | ✆ +972-55-973-7025 | WhatsApp
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-aegis-footer text-sm">
                © {currentYear} Aegis Spectra Security. כל הזכויות שמורות.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/terms" className="text-aegis-footer hover:text-aegis-blue transition-colors">
                  תנאי שירות
                </Link>
                <span className="text-aegis-footer">|</span>
                <Link href="/legal-disclaimer" className="text-aegis-footer hover:text-aegis-blue transition-colors">
                  הצהרת אחריות ושימוש
                </Link>
                <span className="text-aegis-footer">|</span>
                <Link href="/privacy" className="text-aegis-footer hover:text-aegis-blue transition-colors">
                  מדיניות פרטיות
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <a 
                href="tel:+972559737025"
                className="text-aegis-footer hover:text-aegis-blue transition-colors flex items-center space-x-1"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">+972-55-973-7025</span>
              </a>
              <a 
                href="mailto:aegisspectra@gmail.com"
                className="text-aegis-footer hover:text-aegis-blue transition-colors flex items-center space-x-1"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">aegisspectra@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}