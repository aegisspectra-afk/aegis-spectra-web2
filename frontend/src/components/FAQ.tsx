"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

const faqData = [
  {
    question: "כמה זמן לוקחת התקנה?",
    answer: "לרוב 3–6 שעות ל-2–4 מצלמות. עבור מערכות גדולות יותר זה יכול לקחת יום-יומיים.",
  },
  {
    question: "אפליקציה בעברית?",
    answer: "כן, כוללת הדרכה והגדרות לנייד. האפליקציה תומכת בעברית ומאפשרת גישה מרחוק.",
  },
  {
    question: "מה כוללת האחריות?",
    answer: "12 חודשי חלקים ועבודה (נזקי כוח עליון/ונדליזם—לא כלול). תמיכה טכנית בימים א׳–ה׳ 09:00–18:00.",
  },
  {
    question: "תשלומים?",
    answer: "אפשר אשראי/העברה/מזומן; פריסת תשלומים בתיאום לפי הסכם.",
  },
  {
    question: "האם ניתן להרחיב?",
    answer: "כן, ניתן להוסיף נקודות/שדרוגים בכל זמן. נשמח לעזור בתכנון שדרוגים עתידיים.",
  },
  {
    question: "מה קורה אם יש בעיה טכנית?",
    answer: "מענה מהיר בימים א׳–ה׳ 09:00–18:00, ובמקרים דחופים—לפי זמינות. תמיכה ב-WhatsApp וטלפון.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="text-white">שאלות נפוצות</span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              התשובות לשאלות הכי נפוצות על התקנות אבטחה
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction="up">
              <motion.div
                className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-right p-6 flex items-center justify-between hover:bg-zinc-900/50 transition-colors group"
                >
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`size-5 text-zinc-400 transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-zinc-800/50 pt-4">
                        <p className="text-zinc-300 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

