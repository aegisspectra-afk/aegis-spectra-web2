"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Tag, User, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";

export default function BlogPostPage() {
  const params = useParams();
  const postId = params?.id as string;

  // Mock post - in real app, fetch from API
  const post = {
    id: parseInt(postId),
    title: "כיצד לבחור מערכת אבטחה לבית",
    content: `מדריך מקיף לבחירת מערכת אבטחה מתאימה לבית.

בחירת מערכת אבטחה לבית היא החלטה חשובה שדורשת הבנה של הצרכים והאפשרויות הקיימות.

## נקודות חשובות לבחירה:

1. **סוג המצלמות** - מצלמות IP, PoE, WiFi
2. **איכות הצילום** - רזולוציה, ראיית לילה
3. **אחסון** - NVR, HDD, Cloud
4. **אפליקציה** - תמיכה בעברית, גישה מרחוק
5. **מותג** - Provision, Hikvision ועוד מובילים בשוק

## המלצות שלנו:

אנו ממליצים על ציוד מוביל מהשוק כמו Provision, Hikvision ומותגים מובילים אחרים,
עם התקנה מקצועית ותמיכה מלאה.

צרו קשר לפרטים נוספים!`,
    author: "Aegis Spectra",
    published_at: new Date().toISOString(),
    category: "אבטחה",
    tags: ["בית", "מצלמות", "CCTV"]
  };

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="mb-8 text-sm opacity-70">
            <Link href="/" className="hover:text-zinc-300">עמוד הבית</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-zinc-300">בלוג</Link>
            <span className="mx-2">/</span>
            <span>{post.title}</span>
          </nav>
        </ScrollReveal>

        {/* Post Header */}
        <ScrollReveal delay={0.1}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                {post.category}
              </span>
              <span className="text-sm text-zinc-400 flex items-center gap-1">
                <Calendar className="size-4" />
                {new Date(post.published_at).toLocaleDateString("he-IL")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <User className="size-4" />
                {post.author}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Post Content */}
        <ScrollReveal delay={0.2}>
          <article className="rounded-2xl border border-zinc-800 bg-black/30 p-8 md:p-12 backdrop-blur-sm mb-8">
            <div className="prose prose-invert max-w-none">
              <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>
          </article>
        </ScrollReveal>

        {/* Tags */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300">
                #{tag}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 text-center backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">רוצה עוד מידע?</h2>
            <p className="text-zinc-300 mb-6">הזמינו ייעוץ חינם וקבלו הצעת מחיר מותאמת אישית</p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-8 py-4 font-semibold hover:bg-gold/90 transition"
            >
              הזמנת ייעוץ חינם
              <ChevronRight className="size-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

