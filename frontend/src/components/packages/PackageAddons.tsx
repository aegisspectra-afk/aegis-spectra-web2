/**
 * Package Addons Component - תוספות זמינות
 */
'use client';

import { motion } from 'framer-motion';
import { Package } from '@/types/packages';
import { formatPrice } from '@/lib/packages/calculatePrice';
import { Plus } from 'lucide-react';

interface PackageAddonsProps {
  packageData: Package;
  selectedAddons?: string[];
  onAddonToggle?: (addonId: string) => void;
}

export function PackageAddons({ 
  packageData, 
  selectedAddons = [], 
  onAddonToggle 
}: PackageAddonsProps) {
  const addons = packageData.pricing.addons || [];

  if (addons.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            תוספות זמינות
          </h2>
          <p className="text-zinc-400 text-lg">
            ניתן להוסיף לחבילה
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon, index) => {
            const isSelected = selectedAddons.includes(addon.id);
            
            return (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`rounded-xl border ${
                  isSelected 
                    ? 'border-gold bg-gold/10' 
                    : 'border-zinc-800/50 bg-black/40'
                } backdrop-blur-sm p-6 hover:border-zinc-600 transition-all cursor-pointer`}
                onClick={() => onAddonToggle?.(addon.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {addon.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4">
                      {addon.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="size-6 rounded-full bg-gold flex items-center justify-center">
                      <Plus className="size-4 text-black rotate-45" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(addon.price)}
                  </span>
                  {addon.optional && (
                    <span className="text-xs text-zinc-400 px-2 py-1 rounded bg-zinc-800/50">
                      אופציונלי
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

