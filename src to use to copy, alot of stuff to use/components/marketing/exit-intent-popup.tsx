'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Gift, Clock, Shield, Percent } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';

export function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('exit-intent-shown');
    if (hasSeenPopup) {
      setHasShown(true);
      return;
    }

    // Track mouse movement to detect exit intent
    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is moving towards the top of the page (exit intent)
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exit-intent-shown', 'true');
      }
    };

    // Track when user is about to leave the page
    const handleBeforeUnload = () => {
      if (!hasShown) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exit-intent-shown', 'true');
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasShown]);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl mx-4"
          >
            <Card className="relative overflow-hidden">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Header with discount badge */}
              <CardHeader className="text-center bg-gradient-to-r from-red-500 to-pink-500 text-white relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
                  >
                    <Gift className="h-5 w-5" />
                    <span className="font-bold">הצעה מיוחדת!</span>
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2"
                  >
                    רגע! אל תעזוב בלי לקבל הנחה!
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/90"
                  >
                    קבל 15% הנחה מיוחדת על ההזמנה הראשונה שלך
                  </motion.p>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left side - Benefits */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        למה לבחור בנו?
                      </h3>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">אחריות 12 חודשים</p>
                          <p className="text-sm text-aegis-secondary">כל המוצרים עם אחריות מלאה</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">התקנה מקצועית</p>
                          <p className="text-sm text-aegis-secondary">צוות טכנאים מקצועי ומנוסה</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Percent className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">15% הנחה מיוחדת</p>
                          <p className="text-sm text-aegis-secondary">רק למי שממלא את הטופס עכשיו</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">הצעה מוגבלת בזמן!</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        ההנחה תקפה רק למשך 24 שעות מיום מילוי הטופס
                      </p>
                    </motion.div>
                  </div>

                  {/* Right side - Form */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 text-center">
                        מלא את הפרטים וקבל את ההנחה:
                      </h4>
                      <ContactForm />
                    </div>
                  </motion.div>
                </div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-6 pt-4 border-t border-gray-200"
                >
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-aegis-footer">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>אבטחת מידע</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>תשובה תוך 24 שעות</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4" />
                      <span>הנחה מיוחדת</span>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}