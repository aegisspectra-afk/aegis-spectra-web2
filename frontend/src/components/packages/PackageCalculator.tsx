/**
 * Package Price Calculator Component - מחשבון מחיר דינמי
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package } from '@/types/packages';
import { calculatePackagePrice, formatPrice, PackagePriceOptions } from '@/lib/packages/calculatePrice';
import { Calculator, TrendingUp, Info, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToastContext } from '@/components/ToastProvider';
import { CameraSelector } from './CameraSelector';

interface PackageCalculatorProps {
  packageData: Package;
  onPriceChange?: (price: number) => void;
}

export function PackageCalculator({ packageData, onPriceChange }: PackageCalculatorProps) {
  const { addToCart } = useCart();
  const [options, setOptions] = useState<PackagePriceOptions>({
    cameras: packageData.specifications.cameras.default,
    aiDetection: packageData.specifications.aiDetection?.level || 'basic',
    storage: packageData.specifications.storage.size,
    addons: [],
    installationIncluded: packageData.pricing.installation.included,
    maintenance: false,
  });

  const [breakdown, setBreakdown] = useState(
    calculatePackagePrice(packageData, options)
  );

  useEffect(() => {
    const newBreakdown = calculatePackagePrice(packageData, options);
    setBreakdown(newBreakdown);
    onPriceChange?.(newBreakdown.total);
  }, [options, packageData, onPriceChange]);

  const handleAddToCart = () => {
    addToCart({
      sku: `package-${packageData.slug}`,
      name: packageData.nameHebrew,
      price: breakdown.total,
      quantity: 1,
      type: 'package',
      packageSlug: packageData.slug,
      packageOptions: options,
      image: packageData.heroImage || packageData.image,
    });
    // Show success toast
    showToast('החבילה נוספה לעגלה!', 'success', 3000);
  };

  const handleCameraChange = (value: number) => {
    const min = packageData.specifications.cameras.min;
    const max = packageData.specifications.cameras.max;
    const clamped = Math.max(min, Math.min(max, value));
    setOptions({ ...options, cameras: clamped });
  };

  const handleAddonToggle = (addonId: string) => {
    const currentAddons = options.addons || [];
    const newAddons = currentAddons.includes(addonId)
      ? currentAddons.filter((id) => id !== addonId)
      : [...currentAddons, addonId];
    setOptions({ ...options, addons: newAddons });
  };

  return (
    <section id="calculator" className="py-16 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <Calculator className="size-12 text-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            מחשבון מחיר
          </h2>
          <p className="text-zinc-400 text-lg">
            בחר את האפשרויות המתאימות לך וקבל מחיר מדויק
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Options Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cameras */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6"
            >
              <CameraSelector
                min={packageData.specifications.cameras.min}
                max={packageData.specifications.cameras.max}
                value={options.cameras || packageData.specifications.cameras.default}
                onChange={handleCameraChange}
              />
            </motion.div>

            {/* AI Detection */}
            {packageData.specifications.aiDetection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6"
              >
                <label className="block text-white font-bold mb-4">
                  רמת AI Detection
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['basic', 'advanced', 'enterprise'] as const).map((level) => {
                    const levelLabels = {
                      basic: 'בסיסי',
                      advanced: 'מתקדם',
                      enterprise: 'Enterprise',
                    };
                    const isSelected = options.aiDetection === level;
                    return (
                      <button
                        key={level}
                        onClick={() => setOptions({ ...options, aiDetection: level })}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        {levelLabels[level]}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Storage */}
            {packageData.pricing.upgrades?.storage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6"
              >
                <label className="block text-white font-bold mb-4">
                  שדרוג אחסון
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(packageData.pricing.upgrades.storage).map((size) => {
                    const isSelected = options.storage === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setOptions({ ...options, storage: size })}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Addons */}
            {packageData.pricing.addons && packageData.pricing.addons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6"
              >
                <label className="block text-white font-bold mb-4">
                  תוספות
                </label>
                <div className="space-y-3">
                  {packageData.pricing.addons.map((addon) => {
                    const isSelected = options.addons?.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleAddonToggle(addon.id)}
                          className="size-5 rounded border-zinc-600 accent-gold"
                        />
                        <div className="flex-1">
                          <div className="text-white font-semibold">{addon.name}</div>
                          <div className="text-zinc-400 text-sm">{addon.description}</div>
                        </div>
                        <div className="text-gold font-bold">{formatPrice(addon.price)}</div>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Maintenance */}
            {packageData.pricing.maintenance && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.maintenance}
                    onChange={(e) => setOptions({ ...options, maintenance: e.target.checked })}
                    className="size-5 rounded border-zinc-600 accent-gold"
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold">
                      תחזוקה שנתית {packageData.pricing.maintenance.optional ? '(אופציונלי)' : '(מומלץ)'}
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {formatPrice(packageData.pricing.maintenance.annual)} לשנה
                    </div>
                  </div>
                </label>
              </motion.div>
            )}
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky top-8 rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="size-6 text-gold" />
                <h3 className="text-xl font-bold text-white">סיכום מחיר</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>מחיר בסיס</span>
                  <span>{formatPrice(breakdown.base)}</span>
                </div>
                {breakdown.additionalCameras > 0 && (
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>מצלמות נוספות</span>
                    <span>+{formatPrice(breakdown.additionalCameras)}</span>
                  </div>
                )}
                {breakdown.aiUpgrade > 0 && (
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>שדרוג AI</span>
                    <span>+{formatPrice(breakdown.aiUpgrade)}</span>
                  </div>
                )}
                {breakdown.storageUpgrade > 0 && (
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>שדרוג אחסון</span>
                    <span>+{formatPrice(breakdown.storageUpgrade)}</span>
                  </div>
                )}
                {breakdown.addons > 0 && (
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>תוספות</span>
                    <span>+{formatPrice(breakdown.addons)}</span>
                  </div>
                )}
                {breakdown.installation > 0 && (
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>התקנה</span>
                    <span>+{formatPrice(breakdown.installation)}</span>
                  </div>
                )}
                {breakdown.maintenance > 0 && (
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>תחזוקה שנתית</span>
                    <span>+{formatPrice(breakdown.maintenance)}</span>
                  </div>
                )}
                {breakdown.discounts > 0 && (
                  <div className="flex justify-between text-gold text-sm font-semibold">
                    <span>הנחות</span>
                    <span>-{formatPrice(breakdown.discounts)}</span>
                  </div>
                )}
                <div className="border-t border-zinc-700 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">סה&quot;כ</span>
                    <span className="text-gold font-extrabold text-2xl">
                      {formatPrice(breakdown.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full px-6 py-3 rounded-lg bg-gold text-black font-bold text-center hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="size-5" />
                  הוסף לעגלה
                </button>
                <a
                  href={`/quote?package=${packageData.slug}`}
                  className="block w-full px-6 py-3 rounded-lg border-2 border-gold bg-gold/10 text-gold font-bold text-center hover:bg-gold/20 transition-colors"
                >
                  בקש הצעת מחיר
                </a>
                <a
                  href="#contact"
                  className="block w-full px-6 py-3 rounded-lg border-2 border-zinc-600 text-white font-bold text-center hover:bg-zinc-800 transition-colors"
                >
                  צור קשר
                </a>
              </div>

              {packageData.pricing.installation.included && (
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-700/50">
                  <div className="flex items-start gap-2">
                    <Info className="size-4 text-gold mt-0.5 flex-shrink-0" />
                    <div className="text-zinc-400 text-xs">
                      התקנה מקצועית כלולה במחיר
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

