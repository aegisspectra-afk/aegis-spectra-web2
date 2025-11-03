'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = '972559737025'; // Aegis Spectra WhatsApp number
  const message = 'שלום! אני מעוניין לקבל הצעת מחיר למערכת אבטחה';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePhoneClick = () => {
    window.open(`tel:+972559737025`, '_self');
  };

  const handleEmailClick = () => {
    window.open('mailto:info@aegis-spectra.co.il?subject=שאילתה על מערכות מיגון', '_self');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chat Options */}
      {isOpen && (
        <div className="mb-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-4 space-y-3 min-w-[200px]"
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">איך נוכל לעזור?</h3>
              <p className="text-sm text-gray-600">בחר דרך יצירת קשר</p>
            </div>
            
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              onClick={handlePhoneClick}
              variant="outline"
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              התקשר עכשיו
            </Button>
            
            <Button
              onClick={handleEmailClick}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              שלח מייל
            </Button>
          </motion.div>
        </div>
      )}

      {/* Main Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
      )}
    </div>
  );
}