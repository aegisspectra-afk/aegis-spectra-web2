'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  Send
} from 'lucide-react';

export function OnlineChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has interacted with chat before
    const chatInteracted = localStorage.getItem('chat-interacted');
    if (chatInteracted) {
      setHasInteracted(true);
    }
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem('chat-interacted', 'true');
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleMinimizeChat = () => {
    setIsMinimized(true);
  };

  const handleMaximizeChat = () => {
    setIsMinimized(false);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '972559737025'; // Aegis Spectra WhatsApp number
    const message = encodeURIComponent('שלום! אני מעוניין לקבל הצעת מחיר למערכת אבטחה.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    console.log('Opening WhatsApp:', whatsappUrl); // Debug log
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneClick = () => {
    window.open('tel:+972559737025', '_self');
  };

  const handleEmailClick = () => {
    window.open('mailto:info@aegis-spectra.co.il?subject=פנייה לשירותי אבטחה', '_self');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 left-6 z-[9999]"
      >
        <Button
          onClick={handleWhatsAppClick}
          size="lg"
          className="rounded-full h-16 w-16 shadow-2xl border-2 border-white flex items-center justify-center"
          title="צור קשר ב-WhatsApp"
          style={{ 
            backgroundColor: '#25D366',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)'
          }}
        >
          <div className="text-white text-3xl">💬</div>
        </Button>
        
        {/* Pulse animation for new users */}
        {!hasInteracted && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full bg-green-500 opacity-30 -z-10"
          />
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-6 z-50 w-80"
          >
            <Card className="shadow-2xl">
              {!isMinimized ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">צ'אט אונליין</CardTitle>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-aegis-secondary">מחובר</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleMinimizeChat}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCloseChat}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Welcome Message */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-aegis-teal rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white font-bold">א</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">שלום! 👋</p>
                          <p className="text-sm text-aegis-secondary">
                            איך אני יכול לעזור לך היום? אתה יכול לבחור באחת מהאפשרויות למטה או לכתוב לי ישירות.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">אפשרויות מהירות:</h4>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          variant="outline"
                          className="justify-start h-auto p-3"
                          onClick={handleWhatsAppClick}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                              <p className="font-medium">WhatsApp</p>
                              <p className="text-xs text-aegis-secondary">שלח הודעה ב-WhatsApp</p>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="justify-start h-auto p-3"
                          onClick={handlePhoneClick}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <Phone className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                              <p className="font-medium">התקשר אלינו</p>
                              <p className="text-xs text-aegis-secondary">050-123-4567</p>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="justify-start h-auto p-3"
                          onClick={handleEmailClick}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <Mail className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                              <p className="font-medium">שלח אימייל</p>
                              <p className="text-xs text-aegis-secondary">info@aegis-spectra.com</p>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">שעות פעילות</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        א׳-ה׳ 8:00-18:00, ו׳ 8:00-14:00
                      </p>
                    </div>

                    {/* Response Time */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">זמן תגובה</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        בדרך כלל תוך דקות ספורות
                      </p>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">צ'אט אונליין</CardTitle>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-aegis-secondary">מחובר</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleMaximizeChat}
                        className="h-8 w-8"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCloseChat}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}