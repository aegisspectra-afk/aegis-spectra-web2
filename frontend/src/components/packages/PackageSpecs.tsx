/**
 * Package Specifications Component - מפרט טכני
 */
'use client';

import { motion } from 'framer-motion';
import { Package } from '@/types/packages';

interface PackageSpecsProps {
  packageData: Package;
}

export function PackageSpecs({ packageData }: PackageSpecsProps) {
  const specs = packageData.specifications;

  return (
    <section className="py-16 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            מפרט טכני מפורט
          </h2>
          <p className="text-zinc-400 text-lg">
            כל הפרטים הטכניים של החבילה
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-4 text-right text-white font-bold">קטגוריה</th>
                  <th className="px-6 py-4 text-right text-white font-bold">פירוט</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {/* מצלמות */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-300 font-semibold">מצלמות</td>
                  <td className="px-6 py-4 text-white">
                    {specs.cameras.min === specs.cameras.max ? (
                      `${specs.cameras.min} מצלמות`
                    ) : (
                      `${specs.cameras.min}-${specs.cameras.max} מצלמות`
                    )} ({specs.cameras.types.join(', ')})
                  </td>
                </tr>

                {/* NVR */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-300 font-semibold">NVR/DVR</td>
                  <td className="px-6 py-4 text-white">
                    {specs.nvr.type} {specs.nvr.model && `(${specs.nvr.model})`}
                  </td>
                </tr>

                {/* אחסון */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-300 font-semibold">אחסון</td>
                  <td className="px-6 py-4 text-white">
                    {specs.storage.size} ({specs.storage.type})
                    {specs.storage.recordingTime && ` • כ-${specs.storage.recordingTime} הקלטה`}
                  </td>
                </tr>

                {/* AI Detection */}
                {specs.aiDetection && (
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 text-zinc-300 font-semibold">AI Detection</td>
                    <td className="px-6 py-4 text-white">
                      <div className="space-y-1">
                        <div className="font-semibold">{specs.aiDetection.level}</div>
                        <div className="text-sm text-zinc-400">
                          {specs.aiDetection.features.join(', ')}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* אפליקציה */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-300 font-semibold">אפליקציה</td>
                  <td className="px-6 py-4 text-white">
                    <div className="space-y-1">
                      <div>{specs.app.platforms.join(' / ')} • {specs.app.language}</div>
                      <div className="text-sm text-zinc-400">
                        {specs.app.features.join(', ')}
                      </div>
                    </div>
                  </td>
                </tr>

                {/* UPS */}
                {specs.ups && (
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 text-zinc-300 font-semibold">UPS</td>
                    <td className="px-6 py-4 text-white">
                      {specs.ups.included ? 'כלול' : 'אופציונלי'} {specs.ups.model && `(${specs.ups.model})`}
                    </td>
                  </tr>
                )}

                {/* בקרת כניסה */}
                {specs.accessControl && (
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 text-zinc-300 font-semibold">בקרת כניסה</td>
                    <td className="px-6 py-4 text-white">
                      {specs.accessControl.included ? 'כלול' : 'אופציונלי'} {specs.accessControl.type && `(${specs.accessControl.type})`}
                    </td>
                  </tr>
                )}

                {/* אזעקה */}
                {specs.alarm && (
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 text-zinc-300 font-semibold">אזעקה</td>
                    <td className="px-6 py-4 text-white">
                      {specs.alarm.included ? 'כלול' : 'אופציונלי'} {specs.alarm.type && `(${specs.alarm.type})`}
                    </td>
                  </tr>
                )}

                {/* תמיכה */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-300 font-semibold">תמיכה טכנית</td>
                  <td className="px-6 py-4 text-white">
                    <div className="space-y-1">
                      <div className="font-semibold">{specs.support.level}</div>
                      {specs.support.responseTime && (
                        <div className="text-sm text-zinc-400">זמן תגובה: {specs.support.responseTime}</div>
                      )}
                      <div className="text-sm text-zinc-400">
                        {specs.support.features.join(', ')}
                      </div>
                    </div>
                  </td>
                </tr>

                {/* אחריות */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-300 font-semibold">אחריות</td>
                  <td className="px-6 py-4 text-white">
                    <div className="space-y-1">
                      <div className="font-semibold">{specs.warranty.months} חודשים</div>
                      <div className="text-sm text-zinc-400">
                        {specs.warranty.coverage.join(', ')}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

