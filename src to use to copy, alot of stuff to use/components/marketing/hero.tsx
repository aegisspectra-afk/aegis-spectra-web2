'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Camera, Smartphone } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 flex items-center justify-center overflow-hidden min-h-[80vh]">
      {/* Background Effects - Professional Military Grade */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-aegis-gray/5 to-aegis-gray/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-aegis-blue/15 via-aegis-blue/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-aegis-green/10 via-transparent to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Shield className="h-16 w-16 text-aegis-blue/30" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <Camera className="h-12 w-12 text-aegis-green/30" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <Smartphone className="h-14 w-14 text-aegis-blue/20" />
      </div>

      <div className="container-max relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8" style={{color: '#F5F5F5'}}>
              מיגון ואבטחה מתקדמים לבית ולעסק
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto leading-relaxed"
            style={{color: '#E0E0E0'}}
          >
            התקנת מצלמות, אזעקות וקודנים — יחד עם פלטפורמת SaaS לניהול ואכיפה.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg mb-12 max-w-2xl mx-auto"
            style={{color: '#A0A0A0'}}
          >
            אתר זה מציג את פתרונות המיגון והשירות. את המערכת (SaaS) מפעילים ב־app (דשבורד, RBAC, Multi‑tenant).
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
          <a 
            href="https://wa.me/972559737025" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-lg px-8 py-4 rounded-md font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              backgroundColor: '#1A73E8 !important',
              color: '#FFFFFF !important',
              border: '2px solid #1A73E8 !important'
            }}
          >
            <Smartphone className="h-5 w-5 mr-2" style={{color: '#FFFFFF !important'}} />
            <span style={{color: '#FFFFFF !important'}}>קבל הצעת מחיר עכשיו</span>
          </a>
          <Button asChild size="lg" variant="aegisOutline" className="text-lg px-8 py-4" style={{borderColor: '#1A73E8', color: '#1A73E8'}}>
            <Link href="/saas">
              <Camera className="h-5 w-5 mr-2" />
              הכירו את המערכת (SaaS)
            </Link>
          </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{color: '#1A73E8'}}>24-72</div>
            <div style={{color: '#A0A0A0'}}>שעות התקנה</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{color: '#1A73E8'}}>12</div>
            <div style={{color: '#A0A0A0'}}>חודשי אחריות</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{color: '#1A73E8'}}>09:00-18:00</div>
            <div style={{color: '#A0A0A0'}}>מענה מהיר בימים א׳–ה׳</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}