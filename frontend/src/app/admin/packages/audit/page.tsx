/**
 * Package Price Audit Page - עמוד בדיקת מחירי חבילות
 */
'use client';

import { useState, useEffect } from 'react';
import { generateAuditReport, PackageAuditResult } from '@/lib/packages/packagePriceAudit';
import { AlertCircle, CheckCircle, XCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function PackageAuditPage() {
  const [report, setReport] = useState<ReturnType<typeof generateAuditReport> | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    const auditReport = generateAuditReport();
    setReport(auditReport);
  }, []);

  if (!report) {
    return (
      <div className="p-8">
        <div className="text-white">טוען דוח בדיקה...</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: PackageAuditResult['status']) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="size-5 text-green-500" />;
      case 'too-low':
        return <TrendingDown className="size-5 text-red-500" />;
      case 'too-high':
        return <TrendingUp className="size-5 text-yellow-500" />;
      case 'missing-data':
        return <AlertCircle className="size-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: PackageAuditResult['status']) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500/10 border-green-500/50';
      case 'too-low':
        return 'bg-red-500/10 border-red-500/50';
      case 'too-high':
        return 'bg-yellow-500/10 border-yellow-500/50';
      case 'missing-data':
        return 'bg-orange-500/10 border-orange-500/50';
    }
  };

  return (
    <div className="p-8 bg-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">בדיקת מחירי חבילות</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 border border-zinc-800 rounded-lg p-6">
            <div className="text-zinc-400 text-sm mb-2">סה&quot;כ חבילות</div>
            <div className="text-3xl font-bold text-white">{report.summary.total}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6">
            <div className="text-green-400 text-sm mb-2">תקין</div>
            <div className="text-3xl font-bold text-green-500">{report.summary.ok}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
            <div className="text-red-400 text-sm mb-2">נמוך מדי</div>
            <div className="text-3xl font-bold text-red-500">{report.summary.tooLow}</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-6">
            <div className="text-yellow-400 text-sm mb-2">גבוה מדי</div>
            <div className="text-3xl font-bold text-yellow-500">{report.summary.tooHigh}</div>
          </div>
        </div>

        {/* Package List */}
        <div className="bg-black/40 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">חבילה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">מחיר נוכחי</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">מחיר מחושב</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">הבדל</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {report.results.map((result) => (
                  <tr
                    key={result.packageId}
                    className={`hover:bg-zinc-900/50 transition-colors ${
                      selectedPackage === result.packageId ? 'bg-zinc-900/70' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{result.packageName}</div>
                      <div className="text-zinc-400 text-sm">{result.packageId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">{formatPrice(result.currentPrice)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-300">{formatPrice(result.calculatedPrice)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`font-semibold ${
                          result.difference > 0
                            ? 'text-yellow-500'
                            : result.difference < 0
                            ? 'text-red-500'
                            : 'text-green-500'
                        }`}
                      >
                        {result.difference > 0 ? '+' : ''}
                        {formatPrice(result.difference)} ({result.differencePercent > 0 ? '+' : ''}
                        {result.differencePercent.toFixed(1)}%)
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="text-zinc-300 text-sm">
                          {result.status === 'ok' && 'תקין'}
                          {result.status === 'too-low' && 'נמוך מדי'}
                          {result.status === 'too-high' && 'גבוה מדי'}
                          {result.status === 'missing-data' && 'נתונים חסרים'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setSelectedPackage(
                            selectedPackage === result.packageId ? null : result.packageId
                          )
                        }
                        className="text-gold hover:text-gold/80 text-sm font-medium"
                      >
                        {selectedPackage === result.packageId ? 'הסתר פרטים' : 'הצג פרטים'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Package Details */}
        {selectedPackage && (
          <div className="mt-8 bg-black/40 border border-zinc-800 rounded-lg p-6">
            {(() => {
              const result = report.results.find(r => r.packageId === selectedPackage);
              if (!result) return null;

              return (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">{result.packageName}</h2>

                  {/* Issues */}
                  {result.issues.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="size-5 text-orange-500" />
                        <h3 className="text-lg font-semibold text-white">בעיות שזוהו</h3>
                      </div>
                      <ul className="space-y-2">
                        {result.issues.map((issue, idx) => (
                          <li key={idx} className="text-orange-400 flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">פירוט מחירים</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <div className="text-zinc-400 text-sm mb-1">מצלמות</div>
                        <div className="text-white font-semibold">{formatPrice(result.components.cameras)}</div>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <div className="text-zinc-400 text-sm mb-1">NVR</div>
                        <div className="text-white font-semibold">{formatPrice(result.components.nvr)}</div>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <div className="text-zinc-400 text-sm mb-1">אחסון</div>
                        <div className="text-white font-semibold">{formatPrice(result.components.storage)}</div>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <div className="text-zinc-400 text-sm mb-1">UPS</div>
                        <div className="text-white font-semibold">{formatPrice(result.components.ups)}</div>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <div className="text-zinc-400 text-sm mb-1">התקנה</div>
                        <div className="text-white font-semibold">{formatPrice(result.components.installation)}</div>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <div className="text-zinc-400 text-sm mb-1">תחזוקה</div>
                        <div className="text-white font-semibold">{formatPrice(result.components.maintenance)}</div>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <div className="text-zinc-400 text-sm mb-1">תוספות</div>
                        <div className="text-white font-semibold">{formatPrice(result.components.accessories)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Comparison */}
                  <div className="bg-zinc-900/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">השוואת מחירים</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-zinc-400 text-sm mb-2">מחיר נוכחי</div>
                        <div className="text-2xl font-bold text-white">{formatPrice(result.currentPrice)}</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 text-sm mb-2">מחיר מחושב (על בסיס מוצרים)</div>
                        <div className="text-2xl font-bold text-zinc-300">{formatPrice(result.calculatedPrice)}</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                      <div className="flex items-center justify-between">
                        <div className="text-zinc-400">הבדל</div>
                        <div
                          className={`text-xl font-bold ${
                            result.difference > 0
                              ? 'text-yellow-500'
                              : result.difference < 0
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`}
                        >
                          {result.difference > 0 ? '+' : ''}
                          {formatPrice(result.difference)} ({result.differencePercent > 0 ? '+' : ''}
                          {result.differencePercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

