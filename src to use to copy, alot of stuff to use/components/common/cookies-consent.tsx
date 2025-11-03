'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cookie, X, Shield, Settings } from 'lucide-react';
import Link from 'next/link';

export function CookiesConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookies-consent');
    if (!consent) {
      // Show consent bar after 2 seconds
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setHasConsented(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-consent', 'accepted');
    setShowConsent(false);
    setHasConsented(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookies-consent', 'declined');
    setShowConsent(false);
    setHasConsented(true);
  };

  if (hasConsented || !showConsent) {
    return null;
  }

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <Card className="max-w-4xl mx-auto bg-gray-900 border-gray-700 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Cookie Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Cookie className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      פרטיות
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    אנו משתמשים בעוגיות (Cookies)
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    אנו משתמשים בעוגיות כדי לשפר את החוויה שלך באתר, לנתח תנועה ולספק תוכן מותאם אישית. 
                    על ידי המשך השימוש באתר, אתה מסכים לשימוש בעוגיות בהתאם ל-
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                      מדיניות הפרטיות
                    </Link> שלנו.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecline}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    דחה
                  </Button>
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    קבל הכל
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}