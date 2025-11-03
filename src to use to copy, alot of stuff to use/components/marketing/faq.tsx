'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqData = [
  {
    question: 'כמה זמן לוקחת התקנה?',
    answer: 'לרוב 3–6 שעות ל-2–4 מצלמות.',
  },
  {
    question: 'אפליקציה בעברית?',
    answer: 'כן, כוללת הדרכה והגדרות לנייד.',
  },
  {
    question: 'מה כוללת האחריות?',
    answer: '12 חודשי חלקים ועבודה (נזקי כוח עליון/ונדליזם—לא כלול).',
  },
  {
    question: 'תשלומים?',
    answer: 'אפשר אשראי/העברה/מזומן; פריסת תשלומים בתיאום.',
  },
  {
    question: 'האם ניתן להרחיב?',
    answer: 'כן, ניתן להוסיף נקודות/שדרוגים בכל זמן.',
  },
  {
    question: 'מה קורה אם יש בעיה טכנית?',
    answer: 'מענה מהיר בימים א׳–ה׳ 09:00–18:00, ובמקרים דחופים—לפי זמינות.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">שאלות נפוצות</span>
          </h2>
          <p className="text-xl text-aegis-secondary max-w-3xl mx-auto">
            התשובות לשאלות הכי נפוצות על התקנות אבטחה
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-right p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-border"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-aegis-text">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-aegis-secondary transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-aegis-text leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}