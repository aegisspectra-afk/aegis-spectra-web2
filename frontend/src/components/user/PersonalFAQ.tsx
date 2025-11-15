"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function PersonalFAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(["faq-1"]));
  const [searchTerm, setSearchTerm] = useState("");

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "איך אני יכול לעקוב אחרי ההזמנה שלי?",
      answer: "אתה יכול לעקוב אחרי ההזמנה שלך בעמוד 'הזמנות'. כל הזמנה כוללת סטטוס עדכני וקישור לפרטים נוספים.",
      category: "הזמנות"
    },
    {
      id: "faq-2",
      question: "איך אני יכול לצבור נקודות נאמנות?",
      answer: "נקודות נאמנות נצברות אוטומטית עם כל רכישה. אתה יכול לראות את ההיסטוריה המלאה בעמוד 'נאמנות'.",
      category: "נאמנות"
    },
    {
      id: "faq-3",
      question: "איך אני יכול להוריד חשבונית?",
      answer: "אתה יכול להוריד חשבוניות בעמוד 'דוחות'. לחץ על כפתור ההורדה ליד כל חשבונית.",
      category: "תשלומים"
    },
    {
      id: "faq-4",
      question: "איך אני יכול לשנות את הסיסמה שלי?",
      answer: "לך להגדרות > אבטחה > שינוי סיסמה. תצטרך להזין את הסיסמה הנוכחית ואת הסיסמה החדשה.",
      category: "חשבון"
    },
    {
      id: "faq-5",
      question: "איך אני יכול ליצור קשר עם התמיכה?",
      answer: "אתה יכול לפתוח קריאת שירות בעמוד 'תמיכה' או ליצור קשר ישירות דרך WhatsApp או אימייל.",
      category: "תמיכה"
    },
    {
      id: "faq-6",
      question: "מה זה נקודות נאמנות ואיך אני משתמש בהן?",
      answer: "נקודות נאמנות הן נקודות שאתה צובר עם כל רכישה. אתה יכול להשתמש בהן להחלפה במוצרים או שירותים. ראה את ההיסטוריה והקטלוג בעמוד 'נאמנות'.",
      category: "נאמנות"
    },
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="size-6 text-gold" />
        <h2 className="text-2xl font-bold text-white">שאלות נפוצות</h2>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="חפש שאלות..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
        />
      </div>

      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="size-16 mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-400">לא נמצאו שאלות התואמות לחיפוש</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-xl border border-zinc-800 bg-black/20 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition text-right"
              >
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">{faq.question}</div>
                  <div className="text-xs text-zinc-500">{faq.category}</div>
                </div>
                {openItems.has(faq.id) ? (
                  <ChevronUp className="size-5 text-zinc-400 flex-shrink-0 mr-3" />
                ) : (
                  <ChevronDown className="size-5 text-zinc-400 flex-shrink-0 mr-3" />
                )}
              </button>
              {openItems.has(faq.id) && (
                <div className="px-4 pb-4 text-zinc-300 text-sm border-t border-zinc-800">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

