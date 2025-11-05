/**
 * Package Compare Page - עמוד השוואת חבילות
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { packages } from '@/data/packages';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const togglePackage = (slug: string) => {
    if (selectedPackages.includes(slug)) {
      setSelectedPackages(selectedPackages.filter((s) => s !== slug));
    } else if (selectedPackages.length < 4) {
      setSelectedPackages([...selectedPackages, slug]);
    }
  };

  const selectedPkgs = packages.filter((pkg) => selectedPackages.includes(pkg.slug));

  const comparisonFeatures = [
    { key: 'price', label: 'מחיר בסיס' },
    { key: 'cameras', label: 'מספר מצלמות' },
    { key: 'storage', label: 'אחסון' },
    { key: 'ai', label: 'AI Detection' },
    { key: 'app', label: 'אפליקציה' },
    { key: 'support', label: 'תמיכה' },
    { key: 'warranty', label: 'אחריות' },
  ];

  const getFeatureValue = (pkg: typeof packages[0], feature: string) => {
    switch (feature) {
      case 'price':
        return pkg.priceRange;
      case 'cameras':
        return `${pkg.specifications.cameras.min}-${pkg.specifications.cameras.max}`;
      case 'storage':
        return pkg.specifications.storage.size;
      case 'ai':
        return pkg.specifications.aiDetection?.level || 'אין';
      case 'app':
        return pkg.specifications.app.platforms.join(' / ');
      case 'support':
        return pkg.specifications.support.level;
      case 'warranty':
        return `${pkg.specifications.warranty.months} חודשים`;
      default:
        return '-';
    }
  };

  const areAllSame = (feature: string) => {
    if (selectedPkgs.length === 0) return true;
    const values = selectedPkgs.map((pkg) => getFeatureValue(pkg, feature));
    return new Set(values).size === 1;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
              השוואת חבילות
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              בחר עד 4 חבילות להשוואה מפורטת
            </p>
          </motion.div>

          {/* Package Selection */}
          <div className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {packages.map((pkg) => {
                const isSelected = selectedPackages.includes(pkg.slug);
                return (
                  <motion.button
                    key={pkg.id}
                    onClick={() => togglePackage(pkg.slug)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-gold bg-gold/10'
                        : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-sm font-bold text-white mb-1">{pkg.nameHebrew}</div>
                    <div className="text-xs text-zinc-400">{pkg.priceRange}</div>
                    {isSelected && (
                      <div className="mt-2 size-5 rounded-full bg-gold flex items-center justify-center mx-auto">
                        <Check className="size-3 text-black" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Toggle Highlight Differences */}
          {selectedPkgs.length > 1 && (
            <div className="mb-8 flex items-center justify-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="size-5 rounded border-zinc-600 accent-gold"
                />
                <span className="text-zinc-300">הדגש הבדלים בלבד</span>
              </label>
            </div>
          )}

          {/* Comparison Table */}
          {selectedPkgs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="px-6 py-4 text-right text-white font-bold sticky right-0 bg-zinc-900/50">
                        תכונה
                      </th>
                      {selectedPkgs.map((pkg) => (
                        <th key={pkg.id} className="px-6 py-4 text-center text-white font-bold min-w-[200px]">
                          <div className="space-y-2">
                            <div className="font-bold">{pkg.nameHebrew}</div>
                            <div className="text-sm text-zinc-400">{pkg.priceRange}</div>
                            <Link
                              href={`/packages/${pkg.slug}`}
                              className="inline-flex items-center gap-2 text-xs text-gold hover:text-gold/80 transition-colors"
                            >
                              לפרטים <ArrowRight className="size-3" />
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {comparisonFeatures.map((feature, index) => {
                      const isSame = areAllSame(feature.key);
                      const shouldShow = !highlightDifferences || !isSame || index === 0;

                      if (!shouldShow) return null;

                      return (
                        <tr
                          key={feature.key}
                          className={`hover:bg-zinc-900/30 transition-colors ${
                            highlightDifferences && !isSame ? 'bg-gold/5' : ''
                          }`}
                        >
                          <td className="px-6 py-4 text-zinc-300 font-semibold sticky right-0 bg-black/40 backdrop-blur-sm">
                            {feature.label}
                          </td>
                          {selectedPkgs.map((pkg) => (
                            <td key={pkg.id} className="px-6 py-4 text-center text-white">
                              {getFeatureValue(pkg, feature.key)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-zinc-400 text-lg">
                בחר חבילות להשוואה
              </p>
            </motion.div>
          )}

          {/* CTA */}
          {selectedPkgs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12 text-center space-y-4"
            >
              <p className="text-zinc-400">רוצה הצעת מחיר מותאמת?</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {selectedPkgs.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/quote?package=${pkg.slug}`}
                    className="px-6 py-3 rounded-xl bg-gold text-black font-bold hover:bg-gold/90 transition-colors"
                  >
                    בקש הצעת מחיר - {pkg.nameHebrew}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

