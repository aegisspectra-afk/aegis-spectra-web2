/**
 * All Packages Page - עמוד כל החבילות
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { packages } from '@/data/packages';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TiltCard } from '@/components/TiltCard';
import { Check, Search, Filter } from 'lucide-react';

type CategoryFilter = 'all' | 'Residential' | 'Commercial' | 'Enterprise';

export default function AllPackagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = 
      pkg.nameHebrew.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || pkg.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all' as CategoryFilter, label: 'הכל', count: packages.length },
    { id: 'Residential' as CategoryFilter, label: 'מגזר פרטי', count: packages.filter(p => p.category === 'Residential').length },
    { id: 'Commercial' as CategoryFilter, label: 'מגזר עסקי', count: packages.filter(p => p.category === 'Commercial').length },
    { id: 'Enterprise' as CategoryFilter, label: 'מגזר ארגוני', count: packages.filter(p => p.category === 'Enterprise').length },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
                כל החבילות המותאמות
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                בחר את החבילה המתאימה לך מבין מגוון פתרונות מיגון ואבטחה
              </p>
            </div>
          </ScrollReveal>

          {/* Search and Filters */}
          <ScrollReveal delay={0.1}>
            <div className="mb-8 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="חפש חבילה..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/30 border border-zinc-700 rounded-xl px-12 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-gold/70 transition"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      categoryFilter === cat.id
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Packages Grid */}
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPackages.map((pkg, i) => {
                const gradient = pkg.recommended || pkg.popular
                  ? "from-zinc-700/50 to-zinc-800/50"
                  : "from-zinc-800/50 to-zinc-900/50";
                
                const mainFeatures = pkg.features.slice(0, 4).map(f => f.name);
                
                return (
                  <ScrollReveal key={pkg.id} delay={i * 0.1} direction="up">
                    <TiltCard intensity={15}>
                      <motion.div
                        className={`rounded-3xl border p-6 bg-gradient-to-br ${gradient} backdrop-blur-sm relative overflow-hidden group ${
                          pkg.recommended || pkg.popular
                            ? "border-zinc-600 shadow-[0_0_20px_rgba(113,113,122,0.2)] ring-2 ring-zinc-700/30"
                            : "border-zinc-800/50"
                        }`}
                        whileHover={{ y: -12, scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                      >
                        {(pkg.recommended || pkg.popular) && (
                          <motion.div
                            className="absolute top-0 right-0 bg-zinc-700 text-white px-4 py-1 rounded-bl-xl text-xs font-bold"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {pkg.recommended ? "מומלץ" : "פופולרי"}
                          </motion.div>
                        )}
                        <div className="mb-3">
                          <h3 className="text-xl font-bold mb-1 text-white group-hover:text-zinc-200 transition">
                            {pkg.nameHebrew}
                          </h3>
                          <p className="text-sm text-zinc-400">{pkg.name}</p>
                        </div>
                        <div className="text-2xl font-extrabold text-white mb-4">{pkg.priceRange}</div>
                        <ul className="space-y-2 mb-6">
                          {mainFeatures.map((feature, fi) => (
                            <motion.li
                              key={fi}
                              className="flex items-center gap-2 text-xs sm:text-sm"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: fi * 0.05 }}
                            >
                              <Check className="size-4 text-zinc-300 flex-shrink-0" />
                              <span>{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/packages/${pkg.slug}`}
                            className="block w-full rounded-xl border-2 border-zinc-600 px-4 py-2 text-center text-sm font-semibold hover:bg-zinc-700 hover:text-white transition"
                          >
                            לפרטים
                          </Link>
                          <Link
                            href={`/quote?package=${pkg.slug}`}
                            className="block w-full rounded-xl border-2 border-gold px-4 py-2 text-center text-sm font-semibold bg-gold/10 text-gold hover:bg-gold hover:text-black transition"
                          >
                            בקש הצעת מחיר
                          </Link>
                        </div>
                      </motion.div>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-zinc-400 text-lg">לא נמצאו חבילות התואמות לחיפוש</p>
            </motion.div>
          )}

          {/* CTA */}
          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center space-y-4">
              <p className="text-zinc-400">רוצה להשוות בין חבילות?</p>
              <Link
                href="/packages/compare"
                className="inline-block px-6 py-3 rounded-xl bg-gold text-black font-semibold hover:bg-gold/90 transition-colors"
              >
                השווה בין חבילות
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}

