/**
 * Package Features Component - רשימת תכונות
 */
'use client';

import { motion } from 'framer-motion';
import { Package, PackageFeature } from '@/types/packages';
import { Check } from 'lucide-react';

interface PackageFeaturesProps {
  packageData: Package;
}

export function PackageFeatures({ packageData }: PackageFeaturesProps) {
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
            תכונות עיקריות
          </h2>
          <p className="text-zinc-400 text-lg">
            כל מה שכלול בחבילה
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packageData.features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="size-12 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                    <Check className="size-6 text-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {feature.name}
                  </h3>
                  {feature.description && (
                    <p className="text-zinc-400 text-sm">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

