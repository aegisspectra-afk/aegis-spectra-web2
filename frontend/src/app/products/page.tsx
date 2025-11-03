"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, Package, ShoppingCart } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  sku: string;
  name: string;
  price_regular: number;
  price_sale?: number;
  currency: string;
  short_desc?: string;
  category?: string;
  tags?: string[];
  brand?: string;
  stock?: number;
  images?: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "popular">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.ok && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.short_desc?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price_sale || a.price_regular) - (b.price_sale || b.price_regular);
        case "price-desc":
          return (b.price_sale || b.price_regular) - (a.price_sale || a.price_regular);
        case "popular":
          // Mock popularity - in real app, use views/orders
          return (b.stock || 0) - (a.stock || 0);
        default:
          return a.name.localeCompare(b.name, "he");
      }
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, sortBy]);

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                המוצרים שלנו
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                בחר את המוצר המתאים לך מבין המגוון הרחב שלנו
              </p>
            </div>
          </ScrollReveal>

          {/* Filters & Search */}
          <ScrollReveal delay={0.1}>
            <div className="mb-8 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חיפוש מוצרים..."
                  className="w-full bg-black/30 border border-zinc-700 rounded-xl px-12 py-4 focus:outline-none focus:border-gold/70 transition text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="size-5 text-zinc-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition text-white"
                  >
                    <option value="all">כל הקטגוריות</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition text-white"
                >
                  <option value="name">מיון לפי שם</option>
                  <option value="price-asc">מחיר: נמוך לגבוה</option>
                  <option value="price-desc">מחיר: גבוה לנמוך</option>
                  <option value="popular">פופולריות</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition ${
                      viewMode === "grid"
                        ? "bg-gold text-black"
                        : "bg-black/30 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    <Grid className="size-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition ${
                      viewMode === "list"
                        ? "bg-gold text-black"
                        : "bg-black/30 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    <List className="size-5" />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <p className="text-sm text-zinc-400">
                נמצאו {filteredAndSortedProducts.length} מוצרים
              </p>
            </div>
          </ScrollReveal>

          {/* Products Grid/List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="size-12 border-2 border-zinc-700 border-t-gold rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-400">טוען מוצרים...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="size-16 mx-auto mb-6 text-zinc-600" />
              <h3 className="text-xl font-bold mb-2">לא נמצאו מוצרים</h3>
              <p className="text-zinc-400">נסה לשנות את החיפוש או הסינון</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAndSortedProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.05}>
                  {viewMode === "grid" ? (
                    <Link href={`/product/${product.sku}`}>
                      <ProductCard
                        sku={product.sku}
                        name={product.name}
                        price={product.price_sale || product.price_regular}
                        originalPrice={product.price_sale ? product.price_regular : undefined}
                        description={product.short_desc}
                      />
                    </Link>
                  ) : (
                    <Link href={`/product/${product.sku}`}>
                      <motion.div
                        whileHover={{ x: -8 }}
                        className="rounded-xl border border-zinc-800 bg-black/30 p-6 hover:border-zinc-600 transition flex items-center gap-6"
                      >
                        <div className="size-24 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                          <Package className="size-12 text-zinc-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                              <p className="text-sm text-zinc-400 mb-2">{product.sku}</p>
                              {product.short_desc && (
                                <p className="text-sm text-zinc-300">{product.short_desc}</p>
                              )}
                            </div>
                            <div className="text-left">
                              {product.price_sale && (
                                <p className="text-sm text-zinc-400 line-through mb-1">
                                  {product.price_regular} ₪
                                </p>
                              )}
                              <p className="font-bold text-xl text-gold">
                                {product.price_sale || product.price_regular} ₪
                              </p>
                            </div>
                          </div>
                          {product.category && (
                            <span className="inline-block px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                              {product.category}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  )}
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

