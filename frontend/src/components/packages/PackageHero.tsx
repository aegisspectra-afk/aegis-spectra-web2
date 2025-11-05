/**
 * Package Hero Component - Hero Section לעמודי חבילות
 */
'use client';

import { motion } from 'framer-motion';
import { Package } from '@/types/packages';
import { formatPrice } from '@/lib/packages/calculatePrice';

interface PackageHeroProps {
  packageData: Package;
}

export function PackageHero({ packageData }: PackageHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-charcoal via-zinc-900 to-charcoal">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm font-medium">
              {packageData.category === 'Residential' ? 'מגזר פרטי' : 
               packageData.category === 'Commercial' ? 'מגזר עסקי' : 
               'מגזר ארגוני'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
          >
            <span className="block text-white">{packageData.nameHebrew}</span>
            <span className="block text-zinc-400 text-2xl sm:text-3xl md:text-4xl mt-2">{packageData.name}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-zinc-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {packageData.description}
          </motion.p>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2">
              {packageData.priceRange}
            </div>
            <div className="text-sm text-zinc-400">
              {packageData.pricing.installation.included ? 'התקנה מקצועית כלולה' : 'התקנה נוספת'}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#calculator"
              className="px-8 py-4 rounded-xl bg-gold text-black font-bold text-lg hover:bg-gold/90 transition-colors"
            >
              חשב מחיר
            </a>
            <a
              href={`/quote?package=${packageData.slug}`}
              className="px-8 py-4 rounded-xl border-2 border-zinc-600 text-white font-bold text-lg hover:bg-zinc-800 transition-colors"
            >
              בקש הצעת מחיר
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

