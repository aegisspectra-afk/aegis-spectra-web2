"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, User, Search, Filter, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  category: string;
  tags: string[];
  image?: string;
};

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "כיצד לבחור מערכת אבטחה לבית",
    excerpt: "מדריך מקיף לבחירת מערכת אבטחה מתאימה לבית, כולל המלצות על ציוד מוביל (Provision, Hikvision) ותכונות חשובות",
    content: "",
    author: "Aegis Spectra",
    published_at: new Date().toISOString(),
    category: "אבטחה",
    tags: ["בית", "מצלמות", "CCTV"]
  },
  {
    id: 2,
    title: "יתרונות AI באבטחה",
    excerpt: "כיצד בינה מלאכותית משפרת את יכולות האבטחה - זיהוי איומים, ניתוח התנהגות ותגובה אוטומטית",
    content: "",
    author: "Aegis Spectra",
    published_at: new Date().toISOString(),
    category: "סייבר",
    tags: ["AI", "בינה מלאכותית", "אבטחה"]
  },
  {
    id: 3,
    title: "מיגון פיזי לעסקים",
    excerpt: "מדריך להתקנת מערכות מיגון פיזי לעסקים - מצלמות, חיישנים, בקרת כניסה ואינטגרציה עם מערכת הסייבר",
    content: "",
    author: "Aegis Spectra",
    published_at: new Date().toISOString(),
    category: "עסקים",
    tags: ["עסקים", "מיגון", "IoT"]
  }
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(mockPosts.map(p => p.category)));
  const allTags = Array.from(new Set(mockPosts.flatMap(p => p.tags)));

  const filteredPosts = mockPosts.filter(post => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== "all" && post.category !== categoryFilter) {
      return false;
    }
    if (tagFilter && !post.tags.includes(tagFilter)) {
      return false;
    }
    return true;
  });

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="text-white">בלוג ומדריכים</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              מדריכים, טיפים וחדשות מעולם האבטחה והמיגון
            </p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 mb-8 backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חיפוש במדריכים..."
                  className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-gold/70 transition"
                />
              </div>
              <div>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-gold/70 transition"
                >
                  <option value="all">כל הקטגוריות</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={tagFilter || "all"}
                  onChange={(e) => setTagFilter(e.target.value === "all" ? null : e.target.value)}
                  className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-gold/70 transition"
                >
                  <option value="all">כל התגיות</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.1} direction="up">
              <motion.div
                className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-zinc-600 transition-all h-full flex flex-col"
                whileHover={{ y: -8 }}
              >
                {post.image && (
                  <div className="h-48 bg-zinc-800 relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(post.published_at).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3">{post.title}</h2>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, ti) => (
                      <span key={ti} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-2 text-gold hover:text-gold/80 transition text-sm font-semibold"
                  >
                    קרא עוד
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">לא נמצאו מדריכים</p>
          </div>
        )}
      </div>
    </main>
  );
}

