'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'דוד כהן',
    company: 'טכנולוגיות מתקדמות',
    role: 'מנכ"ל',
    content: 'התקנה מקצועית ומערכת מצלמות מעולה. האפליקציה עובדת מצוין ואני יכול לראות הכל מהנייד. השירות מהיר ואמין.',
    rating: 5,
    image: '/testimonials/david-cohen.jpg'
  },
  {
    name: 'שרה לוי',
    company: 'רשת חנויות',
    role: 'מנהלת תפעול',
    content: 'התקנה נקייה ומסודרת, כבלים נסתרים. מערכת האזעקה עובדת מצוין וההתראות מגיעות מיד לנייד. מומלץ בחום!',
    rating: 5,
    image: '/testimonials/sarah-levy.jpg'
  },
  {
    name: 'מיכאל רוזן',
    company: 'מפעל ייצור',
    role: 'מנהל מתקנים',
    content: 'התקנה מקצועית של 8 מצלמות במפעל. הצוות הגיע בזמן, עבד נקי והשאיר הכל מסודר. האפליקציה קלה לשימוש.',
    rating: 5,
    image: '/testimonials/michael-rosen.jpg'
  },
  {
    name: 'רחל גרין',
    company: 'מתחם מגורים',
    role: 'מנהלת נכסים',
    content: 'שירות מעולה מההתחלה עד הסוף. התקנה מהירה, הדרכה מפורטת ואחריות מלאה. המערכת עובדת ללא בעיות כבר שנה.',
    rating: 5,
    image: '/testimonials/rachel-green.jpg'
  },
  {
    name: 'יוסי אברהם',
    company: 'מסעדה משפחתית',
    role: 'בעלים',
    content: 'התקנו מערכת אבטחה במסעדה שלנו. הצוות הגיע בשבת, עבד בשקט ולא הפריע ללקוחות. המערכת עובדת מצוין כבר 8 חודשים.',
    rating: 5,
    image: '/testimonials/yossi-avraham.jpg'
  },
  {
    name: 'מיכל כהן',
    company: 'משרד עורכי דין',
    role: 'שותפה',
    content: 'מערכת אבטחה מקצועית למשרד שלנו. ההתקנה הייתה נקייה, האפליקציה קלה לשימוש והתמיכה הטכנית מעולה. מומלץ בחום!',
    rating: 5,
    image: '/testimonials/michal-cohen.jpg'
  },
  {
    name: 'אמיר לוי',
    company: 'חנות אלקטרוניקה',
    role: 'מנהל',
    content: 'התקנו 6 מצלמות בחנות. האיכות מעולה, ההקלטות ברורות והאפליקציה עובדת מצוין. השירות מהיר ואמין.',
    rating: 5,
    image: '/testimonials/amir-levy.jpg'
  },
  {
    name: 'תמר רוזן',
    company: 'מתחם משרדים',
    role: 'מנהלת נכסים',
    content: 'התקנה מקצועית של מערכת אבטחה מקיפה במתחם המשרדים. הצוות עבד מסודר, השאיר הכל נקי והמערכת עובדת ללא בעיות.',
    rating: 5,
    image: '/testimonials/tamar-rosen.jpg'
  },
  {
    name: 'אלי גולדברג',
    company: 'מפעל טקסטיל',
    role: 'מנכ"ל',
    content: 'התקנו מערכת אבטחה מתקדמת במפעל. ההתקנה הייתה מקצועית, ההדרכה מפורטת והתמיכה הטכנית זמינה 24/7. מומלץ!',
    rating: 5,
    image: '/testimonials/eli-goldberg.jpg'
  },
  {
    name: 'נועה שטרן',
    company: 'מתחם מגורים יוקרתי',
    role: 'מנהלת נכסים',
    content: 'מערכת אבטחה מקצועית למתחם המגורים. ההתקנה הייתה נקייה, האפליקציה קלה לשימוש והתמיכה הטכנית מעולה. מומלץ בחום!',
    rating: 5,
    image: '/testimonials/noa-stern.jpg'
  },
  {
    name: 'דני כהן',
    company: 'מחסן לוגיסטיקה',
    role: 'מנהל',
    content: 'התקנו מערכת אבטחה במחסן שלנו. הצוות הגיע בזמן, עבד מקצועי והשאיר הכל מסודר. המערכת עובדת מצוין כבר שנה.',
    rating: 5,
    image: '/testimonials/danny-cohen.jpg'
  },
  {
    name: 'רונית גרין',
    company: 'משרד רואי חשבון',
    role: 'שותפה',
    content: 'מערכת אבטחה מקצועית למשרד שלנו. ההתקנה הייתה נקייה, האפליקציה קלה לשימוש והתמיכה הטכנית מעולה. מומלץ בחום!',
    rating: 5,
    image: '/testimonials/ronit-green.jpg'
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container-max">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6"
          >
            <span className="gradient-text">מה הלקוחות שלנו אומרים</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-aegis-secondary max-w-2xl mx-auto"
          >
            מומלץ על ידי עסקים וארגונים ברחבי ישראל
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-aegis-teal/60 mr-2" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="text-aegis-text mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-aegis-teal to-aegis-silver rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-aegis-heading">{testimonial.name}</p>
                        <p className="text-sm text-aegis-secondary">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}