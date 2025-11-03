'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Mail } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 via-aegis-blue/5 to-aegis-highlight/10">
      <div className="container-max">
        <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">הגיע הזמן שלך להצטרף אליהם</span>
          </h2>
          <p className="text-xl text-aegis-secondary mb-8 max-w-2xl mx-auto">
            השאר את הפרטים שלך ונחזור אליך עם הצעה מותאמת אישית לאבטחה מתקדמת.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" variant="aegis" className="text-lg px-8 py-4">
              <Link href="/contact">
                קבל הצעת מחיר
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="aegisOutline" className="text-lg px-8 py-4">
              <Link href="/demo-visit">
                תיאום ביקור מדידה
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-aegis-secondary mb-6 text-lg">
              הצטרף למאות לקוחות מרוצים שכבר בחרו באבטחה מתקדמת
            </p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-center">
                <div className="text-2xl font-bold text-aegis-blue mb-2">50+</div>
                <div className="text-sm text-aegis-secondary">התקנות מוצלחות</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-aegis-blue mb-2">100%</div>
                <div className="text-sm text-aegis-secondary">שביעות רצון</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-aegis-blue mb-2">09:00-18:00</div>
                <div className="text-sm text-aegis-secondary">מענה מהיר</div>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center text-aegis-footer"
          >
            <a 
              href="tel:+972559737025"
              className="flex items-center space-x-2 hover:text-aegis-blue transition-colors cursor-pointer"
            >
              <Phone className="h-5 w-5 text-aegis-blue" />
              <span>+972-55-973-7025</span>
            </a>
            <a 
              href="mailto:aegisspectra@gmail.com"
              className="flex items-center space-x-2 hover:text-aegis-blue transition-colors cursor-pointer"
            >
              <Mail className="h-5 w-5 text-aegis-blue" />
              <span>aegisspectra@gmail.com</span>
            </a>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}